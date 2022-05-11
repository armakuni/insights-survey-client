import { After, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import * as playwright from "@playwright/test";
import { renderSurvey, fetchSurveySubmission } from "./client-side-fixtures.js";

let browser;

BeforeAll(async () => {

    browser = await playwright.chromium.launch({
        headless: true
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

            const messageType = message.type();
            if(messageType !== "log")
                console.log(`Browser console: (${messageType})`, message.text());

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

    async renderSurvey(questions) {

        this.surveyName = `isc_tests_${Date.now()}`;
        this.surveyConfig = { questions };
        await this.openUrl("http://localhost:8080/blank.html");
        if(this.useFakeAPISubmissions) {

            await this.installFakeAPI();

        }
        await this.page.$eval("body", renderSurvey, {
            config: this.surveyConfig,
            name: this.surveyName,
            api: this.useFakeAPISubmissions ? "http://localhost:8080/survey/1234/submissions" : undefined
        });
        this.surveyForm = await this.page.locator("form");


    }

    async installFakeAPI() {
        await this.context.route("**/survey/**", route => {

            this.apiSubmission = JSON.parse(route.request().postData());
            route.fulfill({ body: this.apiSubmission, status: 200, headers: { "Content-Type": "application/json" } });

        });
    }

    async fetchSurveySubmission() {

        return await this.page.evaluate(fetchSurveySubmission, { name: this.surveyName });

    }

}

After(async function() {

    await this.dispose();

});

setWorldConstructor(CustomWorld);
