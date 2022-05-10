import { Given } from "@cucumber/cucumber";
import { renderLikertControl } from "./client-side-fixtures.js";

Given("I placed a likert scale question on the page", async function(dataTable) {

    await this.openUrl("http://localhost:8080/blank.html");
    let { startLabel, endLabel, name, labels, cardinality, allowOther, title } = dataTable.hashes()[0] || {};

    if (labels) {

        labels = labels.split(",").map(x => (x || "").trim());

    }
    if (cardinality) {

        cardinality = Number(cardinality);

    }
    if (startLabel || endLabel) {

        labels = labels || Array.from({ length: cardinality || 5 });
        labels[0] = startLabel;
        labels[labels.length - 1] = endLabel;

    }

    allowOther = allowOther === "true";

    const likertControlName = name || "likert-question";

    await this.page.$eval("body", renderLikertControl, {
        labels,
        name: likertControlName,
        cardinality,
        allowOther,
        title
    });
    this.likertControlFormSelector = await this.page.locator("form");
    this.likertControlName = likertControlName;

});

Given("I have selected a required likert scale question", async function() {
    return "pending";
});

Given("a sequence containing two simple questions", async function() {
    return "pending";
});


