import { After, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import * as playwright from "@playwright/test";
import { renderSurvey, fetchSurveySubmission, configureSurvey } from "./client-side-fixtures.js";

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

    async openBlankPage() {

        await this.openUrl("http://localhost:8080/blank.html");

    }

    async renderSurvey(questions) {

        this.surveyName = `isc_tests_${Date.now()}`;
        this.surveyConfig = { questions };
        await this.openBlankPage();
        if(this.useFakeAPISubmissions) {

            await this.installFakeAPI();

        }
        await this.page.$eval("body", renderSurvey, {
            config: this.surveyConfig,
            name: this.surveyName,
            api: this.useFakeAPISubmissions ? "http://localhost:8080/surveys/1234/submissions" : undefined
        });
        this.surveyForm = await this.page.locator("form");

    }

    async installFakeAPI() {

        const tempSurveys = {};

        await this.context.route("**/surveys", (route, request) => {

            if(request.method() === "POST") {

                const body = request.postDataJSON();
                const newId = Date.now();
                const url = request.url();
                const selfUrl = new URL(url);
                selfUrl.pathname += `/${newId}`;

                const formUrl = new URL(selfUrl);
                formUrl.pathname = "/form.html";
                formUrl.searchParams.set("sid", newId);

                const submissions = new URL(selfUrl);
                submissions.pathname += "/submissions";

                body.metadata.id = newId;
                body.metadata._links = {
                    form: { href: formUrl.href },
                    submissions: { href: submissions.href }
                };
                tempSurveys[newId] = body;
                route.fulfill({
                    status: 201,
                    headers: {
                        "Content-Type": "application/hal+json",
                        "Location": selfUrl.toString()
                    },
                    body: JSON.stringify(body)
                });

            } else {

                route.fulfill({ status: 404 });

            }


        });
        await this.context.route("**/surveys/**", (route, request) => {

            const method = request.method();
            const url = request.url();
            if(method === "POST"){

                this.apiSubmission = JSON.parse(route.request().postData());
                route.fulfill({ body: this.apiSubmission, status: 200, headers: { "Content-Type": "application/json" } });

            } else if(method === "GET" && url.endsWith("/form")) {

                route.continue();

            } else if(method === "GET" && url.match(/surveys\/[^/]*$/)) {

                const sid = /surveys\/([^/]*)$/.exec(url)[1];
                if(sid in tempSurveys) {

                    route.fulfill({ body: JSON.stringify(tempSurveys[sid]), status: 200, headers: { "Content-Type": "application/hal+json" } });

                } else {

                    route.fulfill({ body: "Not found", status: 404 });

                }

            } else {

                throw new Error(`Request handler not implemented: ${method} ${url}`);

            }

        });

    }

    async fetchSurveySubmission() {

        return await this.page.evaluate(fetchSurveySubmission, { name: this.surveyName });

    }

    async configureSurvey(config) {

        const api = "/surveys";
        await this.installFakeAPI();
        return await this.page.evaluate(configureSurvey, { config, api });

    }

}

After(async function() {

    await this.dispose();

});

setWorldConstructor(CustomWorld);
