import { After, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import * as playwright from "@playwright/test";

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

}

After(async function() {

    await this.dispose();

});

setWorldConstructor(CustomWorld);
