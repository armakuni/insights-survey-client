import { After, AfterAll, Before, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import * as playwright from "@playwright/test";
import { renderSurvey, fetchSurveySubmission, configureSurvey } from "./client-side-fixtures.js";
import { installFakeAPI, wellKnownEndpointSurveyFormUrl } from "./fake-api.js";
import { expect } from "@playwright/test";

let browser;
const logs = [];

BeforeAll(async () => {

    browser = await playwright.chromium.launch({
        headless: true
    });

});

Before(async ({ pickle }) => {

    logs.push({
        name: pickle.name,
        uri: pickle.uri
    });

});

class CustomWorld {

    configuredSurveys = [];

    async openUrl(url) {

        await this.ensurePage();
        await this.page.goto(url);

    }

    async ensureContext() {
        this.context = this.context || await browser.newContext();
    }

    async ensurePage() {

        await this.ensureContext();
        this.page = await this.context.newPage();
        this.page.on("console", (message) => {

            logs.push({
                when: new Date(),
                text: message.text(),
                level: message.type()
            })

        });

    }

    async dispose() {

        if(this.context) {

            await this.context.close();

        }

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

}

After(async function(x) {

    if(x.result.status === "FAILED") {

        try {

            logs.push({

                level: "ERROR",
                when: new Date(),
                text: "The scenario failed. Body html was: " + await this.page.innerHTML("body")

            });

        } catch(err) {

            console.error(err);

        }

    }
    await this.dispose();

});

AfterAll(async function() {

    let group = [];
    for(const x of logs) {

        if("uri" in x) {

            render();
            group = [ x ];

        } else {

            group.push(x);

        }

    }
    render()

    function render() {

        if (group.length > 1) {

            const scenario = group.shift();
            console.warn(
`

---- BROWSER MESSAGES ----

Scenario: ${scenario.name} (${scenario.uri})

${group.map(x => `[${x.level.toUpperCase()}] ${x.when?.toISOString()} ${x.text}`).join("\n")}

----

`
            );

        }

    }

});

setWorldConstructor(CustomWorld);


