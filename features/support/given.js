import { Given } from "@cucumber/cucumber";
import { renderLikertControl, renderSurvey } from "./client-side-fixtures.js";

function parseLikertControlConfiguration(config = {}) {

    let {
        "Start label": startLabel,
        "End label": endLabel,
        "Name": name,
        "Labels": labels,
        "Cardinality": cardinality,
        "Allow other": allowOther,
        "Title": title
    } = config

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

    name = name || "likert-question";

    return { labels, name, cardinality, allowOther, title };
}

Given("I placed a likert scale question on the page", async function(dataTable) {

    const questionConfig = dataTable.hashes()[0] || {};
    const controlProps = parseLikertControlConfiguration(questionConfig);
    await this.openUrl("http://localhost:8080/blank.html");
    await this.page.$eval("body", renderLikertControl, controlProps);
    this.likertControlFormSelector = await this.page.locator("form");
    this.likertControlName = controlProps.name;

});

Given("I placed an unconfigured likert scale question on the page", async function() {

    const controlProps = parseLikertControlConfiguration();
    await this.openUrl("http://localhost:8080/blank.html");
    await this.page.$eval("body", renderLikertControl, controlProps);
    this.likertControlFormSelector = await this.page.locator("form");
    this.likertControlName = controlProps.name;

});

Given("I have selected a required likert scale question", async function() {
    return "pending";
});

Given("a sequence containing two simple questions", async function() {
    return "pending";
});

Given("a survey with questions", async function(dataTable) {

    await this.openUrl("http://localhost:8080/blank.html");
    const questions = dataTable.hashes().map(row => {

        switch(row.Type) {
            case "likert":
                return {
                    type: "likert",
                    ...parseLikertControlConfiguration(row)
                };
            default:
                throw new Error(`Unrecognised question type: ${JSON.stringify(row)}`);
        }

    });

    this.surveyName = `isc_tests_${Date.now()}`;
    this.surveyConfig = { questions };

    await this.openUrl("http://localhost:8080/blank.html");
    await this.page.$eval("body", renderSurvey, {
        config: this.surveyConfig,
        name: this.surveyName
    });


});


