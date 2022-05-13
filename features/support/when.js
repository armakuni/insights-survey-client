import { When } from "@cucumber/cucumber";

When("I select likert option {int}", { timeout: 60000 }, async function(expected) {

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

When("I choose option {int} for survey question {int}", { timeout: 180000 }, async function(optionToChoose, surveyQuestion) {

    await this.page.pause();
    await this.page.click(`.question_${surveyQuestion} label:nth-of-type(${optionToChoose})`);

});
