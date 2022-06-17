import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { JSDOM } from "jsdom";
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

Then("the value of the text box is {string}", async function(expected) {

    const formData = await this.formData();
    const actualValue = formData[this.textBoxQuestionName];
    expect(actualValue).toEqual(String(expected));

});

Then("the value of the likert scale is {int}", async function(expected) {

    const formData = await this.formData();
    const actualValue = formData[this.likertControlName];
    expect(actualValue).toEqual(String(expected));

});


Then("the value of the likert scale is {string}", async function(expected) {

    const formData = await this.formData();
    const actualValue = formData[this.likertControlName];
    expect(actualValue).toEqual(expected);

});

Then("the value of the likert scale is unset", async function() {

    const formData = await this.formData();
    expect(this.likertControlName in formData).toBeFalsy();

});

Then("the value of the text box is empty", async function() {

    const formData = await this.formData();
    expect(formData[this.textBoxQuestionName]).toEqual("");

});

Then("the value of the likert scale's other option text is {string}", async function(expected) {

    const formData = await this.formData();
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

function expectedDateTimeFormat(date) {

    const formatter = new Intl.DateTimeFormat("en", {
        weekday: "long", day: "numeric", month: "short", year: "numeric",
        hour: "numeric", minute: "numeric", timeZone: "UTC", timeZoneName: "short"
    });
    return formatter.format(new Date(date));

}

Then("the three submissions are displayed", async function() {

    const submissionsHTML = await this.page.innerHTML(".submissions.loaded");
    const dom = new JSDOM(submissionsHTML);
    const submissions = Array.from(dom.window.document.querySelectorAll(".submission"));
    expect(submissions).toHaveLength(3);

    const expectedSubmissionsMetadata = this.createdSubmissions
        .sort((a, b) => a?.metadata?.created > b?.metadata?.created ? -1 : 1);

    for(let i = 0; i < expectedSubmissionsMetadata.length; i++) {

        const expected = expectedSubmissionsMetadata[i];
        const actual = submissions[i];
        try {

            const when = actual.querySelector("time");
            expect(when).toBeDefined();
            expect(when?.getAttribute("datetime")).toEqual(expected.metadata?.created);
            expect(when?.textContent).toEqual(expectedDateTimeFormat(expected.metadata?.created));
            expect(actual.textContent).toContain(`Id${expected.metadata?.id}`);
            expect(actual.textContent).toContain(`User${expected.client?.id}`);

        } catch(err) {

            throw new Error(`Submission ${i + 1}\n ${err.message}`);

        }

    }

});

Then("the submissions panel is not shown", async function() {

    await this.page.waitForSelector("article.submissions", { state: "detached" });

});

Then("it should show the metadata, questions and answers of the opened submission", async function() {

    const html = await this.page.locator("article.submission").innerHTML();
    const submission = new JSDOM(html).window.document;
    const expected = this.createdSubmissions[0];

    // title
    const title = submission.querySelector("header time");
    expect(title).toBeDefined();
    expect(title?.getAttribute("datetime")).toEqual(expected.metadata?.created);
    expect(title?.textContent).toEqual(expectedDateTimeFormat(expected.metadata?.created));

    // metadata
    const metadata = submission.querySelector(".metadata");
    expect(metadata.textContent).toContain(`Id${expected.metadata?.id}`);
    expect(metadata.textContent).toContain(`User${expected.client?.id}`);

    // questions and answers
    const responseElements = Array.from(submission.querySelectorAll(".question"));
    const { values, config: { questions } } = expected;

    for(let questionIndex = 0; questionIndex < questions.length; questionIndex++) {

        const question = questions[questionIndex];
        try {

            const responseElement = responseElements[questionIndex];
            const value = values[question.name];
            expect(responseElement).toBeDefined();
            expect(responseElement.querySelector(".number")?.textContent).toEqual((questionIndex + 1).toString());
            expect(responseElement.querySelector(".title")?.textContent).toEqual(question.title);
            expect(responseElement.querySelector(".response-value")?.textContent).toEqual(value);

        } catch(err) {

            throw new Error(`For question ${questionIndex + 1} "${question.title}"\n${err}`);

        }

    }

});

Then("the two configured questions should be listed", async function() {

    const expectedIds = this.configuredQuestions.map(q => q.id);
    for(const id of expectedIds) {

        await this.page.waitForSelector(`.question .id:has-text("${id}")`);

    }

});

Then("the questions area is loaded", async function() {

    await this.page.waitForSelector("article.questions.loaded");

});

Then("the survey area is loaded", async function() {

    await this.page.waitForSelector("article.surveys.loaded");

});

Then("the question's name, title, type and tags should be shown", async function() {

    const { id, name, title, type, tags } = this.configuredQuestions[0];
    await expect(this.page.locator(".question .id")).toContainText(id);
    await expect(this.page.locator(".question .name")).toContainText(name);
    await expect(this.page.locator(".question .title")).toContainText(title);
    await expect(this.page.locator(".question .type")).toContainText(type);
    for(let i = 0; i < tags.length; i++) {

        const selector = `.question .tags li:nth-of-type(${i + 1})`;
        const tag = tags[i];
        await expect(this.page.locator(selector)).toContainText(tag);

    }

});

Then("the question editing fields contain the configured values", async function() {

    const { name, title, type, tags } = this.configuredQuestions[0];
    await this.page.waitForSelector(".question-editor.loaded");
    await expect(this.page.locator(".question-editor [name=name]")).toHaveValue(name);
    await expect(this.page.locator(".question-editor [name=title]")).toHaveValue(title);
    await expect(this.page.locator(".question-editor [name=type]")).toHaveValue(type);
    for(let tag of tags) {
        await expect(this.page.locator(`.question-editor .tag:has-text("${tag}")`)).toBeVisible();
    }

});
