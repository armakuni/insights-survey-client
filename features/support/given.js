import { Given } from "@cucumber/cucumber";

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
    return { labels, name, cardinality, allowOther, title };
}

Given("I placed a likert scale question on the page", async function(dataTable) {

    const row = dataTable.hashes()[0] || {};
    const questionConfig = {
        type: "likert",
        ...parseLikertControlConfiguration(row),
        name: "likert_question"
    };
    this.likertControlName = questionConfig.name;
    await this.renderSurvey([ questionConfig ]);

});

Given("I placed an unconfigured likert scale question on the page", async function() {

    const questionConfig = {
        type: "likert",
        ...parseLikertControlConfiguration(),
        name: "likert_question"
    };
    this.likertControlName = questionConfig.name;
    await this.renderSurvey([ questionConfig ]);

});

Given("a survey with questions", async function(dataTable) {

    const questions = dataTable.hashes().map(parseQuestionRow);
    await this.renderSurvey(questions);

});

Given("I have selected a required likert scale question", async function() {
    return "pending";
});

Given("a sequence containing two simple questions", async function() {
    return "pending";
});

Given("the submission handler is an API", async function() {

    this.useFakeAPISubmissions = true;

});

Given("I followed the response link to a pre-prepared survey with the questions", async function(dataTable) {

    const questions = dataTable.hashes().map(parseQuestionRow);
    await this.openBlankPage();
    const config = await this.configureSurveyUsingAFakeAPI({ questions });
    const url = config._links.form.href;
    this.prePreparedSurvey = config;
    await this.openUrl(url);

});

Given("I followed a broken response link to a survey", async function() {

    await this.openBlankPage();
    const config = await this.configureSurveyUsingAFakeAPI({ id: "valid-survey", questions: [] });
    const url = config._links.form.href.replace("valid-survey", "not-found-survey");
    await this.openUrl(url);

});

Given("I followed a response link to a well-known named survey endpoint", async function() {

    await this.openSurveyFormForWellKnownEndpointUsingAFakeAPI();

});

function parseQuestionRow(row) {

    switch (row.Type) {
        case "likert":
            return {
                type: "likert",
                name: "likert-question",
                ...parseLikertControlConfiguration(row)
            };
        default:
            throw new Error(`Unrecognised question type: ${JSON.stringify(row)}`);
    }

}
