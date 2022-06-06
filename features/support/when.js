import { When } from "@cucumber/cucumber";

When("I select likert option {int}", async function(expected) {

    await this.surveyForm.locator(`:nth-match(input[type=radio], ${expected})`).click();

});

When("I deselect a likert option", async function() {

    await this.surveyForm.locator("text=deselect").click();

});

When("I select the {string} likert option", async function(description) {

    if(description !== "other") throw new Error("Unknown option");
    await this.surveyForm.locator(`label:has-text("Other")`).click();

});

When("I enter a value of {string} in the likert other option text box", async function(string_0) {

    await this.surveyForm.locator("input[type=text]").fill(string_0);

});

When("I attempt to progress to the next section", async function() {

    return "pending";

});

When("I start the sequence", async function() {

    return "pending";

});

When("I click the submit button", async function() {

    await this.page.click("[type=submit]");

});

When("I choose option {int} for survey question {int}", async function(optionToChoose, surveyQuestion) {

    await this.page.click(`.question:nth-of-type(${surveyQuestion}) label:nth-of-type(${optionToChoose})`);

});

When("I enter the text {string}", async function(value) {

    await this.page.locator(`.question.${this.textBoxQuestionName} textarea`).fill(value);

});

When("I view the list of surveys", async function() {

    await this.openAdminPage();
    await this.page.waitForSelector("main");

});

When("I view the list of questions", async function() {

    await this.openAdminPage();
    await this.page.waitForSelector("menu");
    await this.page.locator("menu").locator(`a:has-text("Questions")`).click();
    await this.page.waitForSelector(".questions.loaded");

});

When("I click the link to open the form for the configured survey", async function() {

    const { title } = this.configuredSurveys[0];
    const link = this.page
        .locator(`:has-text("${title}")`)
        .locator("xpath=ancestor::li")
        .locator(`a:has-text("Open the response form")`);

    await Promise.all([
        this.context.waitForEvent("page"),
        link.click()
    ]);

});

When("I click the link to open submissions for survey {int}", async function(surveyNumber) {

    const { title } = this.configuredSurveys[surveyNumber - 1];
    const link = this.page
        .locator(`:has-text("${title}")`)
        .locator("xpath=ancestor::li")
        .locator(`a:has-text("View submissions")`);
    await link.click();

});

When("I click the Close icon", async function() {

    await this.page.click(".submissions a.close");

});

When("I open the submission detail for the submission {int}", {timeout: 60000}, async function(number) {

    await this.page.locator(`.submissions li:nth-of-type(${number}) a:has-text("Detail")`).click();
    await this.page.waitForSelector(".submission.loaded");

});

When("I navigate to questions", async function() {

    await this.installFakeAPI();
    await this.openAdminPage();
    await this.page.locator(`a:has-text("Questions")`).click();

});

When("I navigate to surveys", async function() {

    await this.installFakeAPI();
    await this.openAdminPage();
    await this.page.locator(`a:has-text("Surveys")`).click();

});
