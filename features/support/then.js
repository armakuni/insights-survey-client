import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { locatorDOM } from "../support/dom.js";
import { wordToNumber } from "../support/words.js";

Then("the likert scale has {word} options", async function(expected) {

    const likertOptions = this.page.locator(".likert input[type=radio]");
    const expectedNumber = wordToNumber(expected);
    await expect(likertOptions).toHaveCount(expectedNumber);

});

Then("the likert scale's {word} label is {string}", async function(position, expected) {

    function byPosition(items) {
        switch (position) {
            case "start":
                return items[0];
            case "end":
                return items[items.length - 1];
            default:
                return items[wordToNumber(position) - 1];
        }
    }

    const likertDOM = await locatorDOM(this.page.locator(".likert"));
    const labels = Array.from(likertDOM.querySelectorAll("label"));
    const targettedOption = byPosition(labels);
    expect(targettedOption.textContent).toEqual(expected);

});

Then("the value of the likert scale is {int}", async function(expected) {

    const formData = await this.surveyForm.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    const actualValue = formData[this.likertControlName];
    expect(actualValue).toEqual(String(expected));

});


Then("the value of the likert scale is {string}", async function(expected) {

    const formData = await this.surveyForm.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    const actualValue = formData[this.likertControlName];
    expect(actualValue).toEqual(expected);

});

Then("the value of the likert scale is unset", async function() {

    const formData = await this.surveyForm.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    expect(this.likertControlName in formData).toBeFalsy();

});

Then("the value of the likert scale's other option text is {string}", async function(expected) {

    const formData = await this.surveyForm.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    const actualValue = formData[`${this.likertControlName}_other-text`];
    expect(actualValue).toEqual(expected);

});

Then("progressing is blocked with a message {string}", async function(_expectedMessage) {
    return "pending";
});

Then("the first question in the sequence is displayed", async function() {
    return "pending";
});

Then("the title of the likert scale question is shown as {string}", async function(expectedText) {

    const actualText = await this.page.locator(".likert .title").innerText();
    expect(actualText).toEqual(expectedText);

});

Then("the response data is submitted", async function() {

    const submission = await this.fetchSurveySubmission();
    await this.validateSurveySubmission(submission);

});

Then("the response data is submitted to the API", async function() {

    const submission = this.apiSubmission;
    await this.validateSurveySubmission(submission);

});

Then("the response data includes the following results", async function(dataTable) {

    const expectedData = dataTable.hashes().map(row => [ row.Question, row.Value ]);
    const fetched = await this.fetchSurveySubmission();

    const actualData = expectedData.map(([questionNumber]) => {
        const question = fetched.config.questions[questionNumber - 1];
        const valueName = question.name || `question_${questionNumber}`;
        return [questionNumber, fetched.values[valueName]];
    });

    expect(expectedData).toMatchObject(actualData);

});

Then("the response data is submitted to the API for the pre-prepared survey", async function() {

    const { prePreparedSurvey, apiSubmission } = this;
    expect(apiSubmission.survey.id).toEqual(prePreparedSurvey.id);

});

Then("help about a survey not being found is shown", async function() {

    await this.page.waitForSelector("main.loaded");
    const text = await this.page.textContent("body");
    expect(text).toContain("were unable to identify the survey");

});

Then("the survey should be rendered as expected", async function() {

    await this.page.waitForSelector(`[type=submit]:has-text("Submit")`)

});

Then("a message tells me that submission is complete", async function() {

    await this.page.waitForSelector("article.submission-complete");

});

Then("the two configured surveys should be listed", async function() {

    for(const config of this.configuredSurveys) {

        await this.page.waitForSelector(`.survey:has-text("${config.title}")`);

    }

});

Then("the survey form opens in a new window", async function() {

    const pages = this.context.pages();
    const actual = pages[pages.length - 1];
    const { title } = this.configuredSurveys[0];
    await actual.waitForSelector("main.loaded");
    await actual.waitForSelector(`:has-text("${title}")`);

});

Then("the three submissions are displayed", async function() {

    const submissionsHTML = await this.page.innerHTML(".submissions.loaded");
    console.log(submissionsHTML);
    return "pending";

});
