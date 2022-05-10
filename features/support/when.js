import { When } from "@cucumber/cucumber";
import dom from "./dom.js";

When("I select likert option {int}", async function(expected) {

    await this.likertControlFormSelector.locator(`:nth-match(input[type=radio], ${expected})`).click();

});

When("I deselect a likert option", async function() {

    await this.likertControlFormSelector.locator("text=deselect").click();

});

When("I select the {string} likert option", async function(string_0) {

    await this.likertControlFormSelector.locator(`label:has-text("Other")`).click();

});

When("I enter a value of {string} in the likert other option text box", async function(string_0) {

    await this.likertControlFormSelector.locator("input[type=text]").fill(string_0);

});
