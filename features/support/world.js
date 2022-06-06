import { After, AfterAll, Before, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import * as playwright from "@playwright/test";
import {
    renderSurvey,
    fetchSurveySubmission,
    configureSurvey,
    createSubmissionsWithResponses,
    configureQuestion
} from "./client-side-fixtures.js";
import { installFakeAPI, wellKnownEndpointSurveyFormUrl } from "./fake-api.js";
import { expect } from "@playwright/test";
import { monitorStepFailure, renderBrowserMessages } from "./diagnostics.js";

let browser, sharedContext;
const logs = [];

BeforeAll(async () => {

    browser = await playwright.chromium.launch({ headless: true });
    sharedContext = await browser.newContext();

});

Before(async ({ pickle }) => {

    logs.push({
        name: pickle.name,
        uri: pickle.uri
    });

});

class CustomWorld {

    constructor() {
        this.context = sharedContext;
    }

    configuredSurveys = [];
    configuredQuestions = [];

    async openUrl(url) {

        await this.ensurePage();
        await this.page.goto(url);

    }

    log(level, text) {

        logs.push({
            when: new Date(),
            level,
            text
        });

    }

    async ensurePage() {

        this.page = await sharedContext.newPage();
        this.page.on("console", (message) => {

            this.log(message.type(), message.text());

        });

    }

    async screenshot() {

        const path = `./${new Date().toISOString().replace(/ /, "_")}.png`;
        console.warn("Saving screenshot to", path);
        await this.page.screenshot({ path });

    }

    async openBlankPage() {

        await this.openUrl("http://localhost:8080/blank.html");

    }

    async openAdminPage() {

        await this.openUrl("http://localhost:8080/admin");
        this.page.setViewportSize({ width: 1600, height: 900 });
    }

    async installFakeAPI() {

        await installFakeAPI(this);

    }

    async renderSurvey(questions) {

        this.surveyId = `isc_tests_${Date.now()}`;
        this.surveyConfig = { id: this.surveyId, questions };
        await this.openBlankPage();
        if(this.useFakeAPISubmissions) {

            await installFakeAPI(this);

        }
        await this.page.$eval("body", renderSurvey, {
            config: this.surveyConfig,
            api: this.useFakeAPISubmissions ? "http://localhost:8080/surveys/1234/submissions" : undefined
        });
        this.surveyForm = await this.page.locator("form");

    }

    async fetchSurveySubmission() {

        return this.page.evaluate(fetchSurveySubmission, { survey: this.surveyConfig });

    }

    async openSurveyFormForWellKnownEndpointUsingAFakeAPI() {

        await this.openBlankPage();
        await installFakeAPI(this);
        const url = new URL(wellKnownEndpointSurveyFormUrl, await this.page.url());
        await this.openUrl(url.href);

    }

    async configureSurveyUsingAFakeAPI(config) {

        const api = `/surveys/${config.id}/configuration`;
        await this.openBlankPage();
        await installFakeAPI(this);
        const configured = await this.page.evaluate(configureSurvey, { config, api });
        this.configuredSurveys.push(configured);
        return configured;

    }

    async configureQuestionUsingAFakeAPI(config) {

        const api = `/questions/${config.id}/configuration`;
        await this.openBlankPage();
        await installFakeAPI(this);
        const configured = await this.page.evaluate(configureQuestion, { config, api });
        this.configuredQuestions.push(configured);
        return configured;

    }

    async validateSurveySubmission(submission) {

        expect(submission).toHaveProperty("metadata");
        expect(submission.metadata).toHaveProperty("created");

        expect(submission).toHaveProperty("values");

        expect(submission).toHaveProperty("client");
        expect(submission.client.location).toEqual(await this.page.url());
        expect(submission.client.id).toBeTruthy();

        expect(submission).toHaveProperty("survey");
        expect(submission.survey.id).toEqual(this.surveyId);

        expect(submission).toHaveProperty("config");
        expect(submission.config).toEqual(JSON.parse(JSON.stringify(this.surveyConfig)));

    }

    async submitForSurvey(config, submissionCount = 1) {

        const responsesForSubmissions =  new Array(submissionCount).fill([]);
        return this.sendSubmissionsWithResponses(config, responsesForSubmissions);

    }

    async sendSubmissionsWithResponses(config, responsesForSubmissions) {

        const endpoint = config._links.submissions.href;
        const survey = { id: config.id };
        const created = await this.page.evaluate(createSubmissionsWithResponses, { endpoint, survey, config, responsesForSubmissions })
        this.createdSubmissions = this.createdSubmissions || [];
        this.createdSubmissions.push(...(created || []).map(x => x.data));

    }

    async formData() {
        return this.surveyForm.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    }

}

setWorldConstructor(CustomWorld);

After(async function(scenarioContext) {

    await monitorStepFailure(this, scenarioContext, logs);

});

AfterAll(async function() {

    renderBrowserMessages(logs);
    await sharedContext.close();

});

