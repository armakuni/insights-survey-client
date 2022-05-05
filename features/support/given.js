import { Given } from "@cucumber/cucumber";
import { renderLikertControl, likertControlName } from "./client-side-fixtures.js";

Given("I placed a likert-scale question on the page", async function(dataTable) {

    await this.openUrl("http://localhost:8080/blank.html");
    const { startLabel, endLabel } = dataTable.hashes()[0] || {};
    const labels = [ startLabel,,,,endLabel ];
    await this.page.$eval("body", renderLikertControl, { labels, likertControlName });
    this.likertControlFormSelector = await this.page.locator("form");

});


