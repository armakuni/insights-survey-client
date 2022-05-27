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

Given("I placed a text box question on the page", async function() {

    const questionConfig = {
        type: "text-box",
        name: "text_box_question"
    };
    this.textBoxQuestionName = questionConfig.name;
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
    const config = await this.configureSurveyUsingAFakeAPI({ id: "pre-prepared", questions });
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

Given("{int} survey(s) have/has been configured", async function(surveyCount) {

    for(let i = 0; i < surveyCount; i++) {

        await this.configureSurveyUsingAFakeAPI({ id: `survey-${i + 1}`, title: `Survey ${i + 1}`, questions: [] });

    }

});

Given("{int} questions have been configured", async function(questionCount) {

    for(let i = 0; i < questionCount; i++) {

        await this.configureQuestionUsingAFakeAPI({ id: `3784682736_${i}`, name: "resp-name", title: "What is your name?", type: "text" });

    }

});

Given("three submissions exist for configured survey {int}", async function(surveyNumber) {

    const survey = this.configuredSurveys[surveyNumber - 1];
    await this.submitForSurvey(survey, 3);

});

Given("I openned the submissions panel", { timeout: 60000 }, async function() {
    await this.configureSurveyUsingAFakeAPI({ id: "survey-1", title: "Survey 1", questions: [] });
    await this.openAdminPage();
    await this.page.click(`a:has-text("View submissions")`);
    await this.page.waitForSelector(".submissions.loaded");
});

const camely = obj => Object.fromEntries(
    Object.keys(obj).map(key => [
        `${key[0].toLowerCase()}${key.slice(1)}`,
        obj[key]
    ])
);

Given("I have submitted the survey with responses", async function(dataTable) {

    const submissions = dataTable.hashes().map(camely);
    await this.sendSubmissionsWithResponses(this.prePreparedSurvey, [ submissions ]);

});

Given("I view submissions for the pre-prepared survey", async function() {
    await this.openAdminPage();
    const { title, id } = this.prePreparedSurvey;
    const link = this.page
        .locator(`:has-text("${title || id}")`)
        .locator("xpath=ancestor::li")
        .locator(`a:has-text("View submissions")`);
    await link.click();
    await this.page.waitForSelector(".submissions.loaded");

});
