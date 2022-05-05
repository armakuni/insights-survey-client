import { After, BeforeAll, setWorldConstructor } from "@cucumber/cucumber";
import * as playwright from "@playwright/test";

let browser;
let context;

BeforeAll(async () => {

    browser = await playwright.chromium.launch({
        headless: true
    });

});

class CustomWorld {

    async openUrl(url) {

        this.context = this.context || await browser.newContext();
        this.page = await this.context.newPage();
        await this.page.goto(url);

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
