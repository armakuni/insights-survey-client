import { After, AfterAll, Before, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import * as playwright from "@playwright/test";
import { renderSurvey, fetchSurveySubmission, configureSurvey } from "./client-side-fixtures.js";
import { installFakeAPI, wellKnownEndpointSurveyFormUrl } from "./fake-api.js";

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

    async openUrl(url) {

        await this.ensurePage();
        await this.page.goto(url);

    }

    async ensurePage() {

        this.context = this.context || await browser.newContext();
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

    async renderSurvey(questions) {

        this.surveyName = `isc_tests_${Date.now()}`;
        this.surveyConfig = { questions };
        await this.openBlankPage();
        if(this.useFakeAPISubmissions) {

            await installFakeAPI(this);

        }
        await this.page.$eval("body", renderSurvey, {
            config: this.surveyConfig,
            name: this.surveyName,
            api: this.useFakeAPISubmissions ? "http://localhost:8080/surveys/1234/submissions" : undefined
        });
        this.surveyForm = await this.page.locator("form");

    }

    async fetchSurveySubmission() {

        return await this.page.evaluate(fetchSurveySubmission, { name: this.surveyName });

    }

    async openSurveyFormForWellKnownEndpointUsingAFakeAPI() {

        await this.openBlankPage();
        await installFakeAPI(this);
        const url = new URL(wellKnownEndpointSurveyFormUrl, await this.page.url());
        await this.openUrl(url.href);

    }

    async configureSurveyUsingAFakeAPI(config) {

        const api = "/surveys";
        await installFakeAPI(this);
        return await this.page.evaluate(configureSurvey, { config, api });

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


