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

    const fetched = await this.fetchSurveySubmission();
    expect(fetched).toHaveProperty("submission");
    expect(fetched.submission).toHaveProperty("created");
    expect(fetched).toHaveProperty("values");
    expect(fetched).toHaveProperty("survey");

});

Then("the response data is submitted to the API", async function() {

    expect(this.apiSubmission).toHaveProperty("submission");
    expect(this.apiSubmission).toHaveProperty("values");
    expect(this.apiSubmission).toHaveProperty("survey");

});

Then("the response data includes the following results", async function(dataTable) {

    const expectedData = dataTable.hashes().map(row => [ row.Question, row.Value ]);
    const fetched = await this.fetchSurveySubmission();
    const actualData = expectedData.map(([questionNumber]) => {
        const question = fetched.survey.questions[questionNumber - 1];
        const valueName = question.name || `question_${questionNumber}`;
        return [questionNumber, fetched.values[valueName]];
    });
    expect(expectedData).toMatchObject(actualData);

});
