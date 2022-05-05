import { When } from "@cucumber/cucumber";

When("I select likert option {int}", async function(expected) {

    await this.likertControlFormSelector.locator(`:nth-match(input[type=radio], ${expected})`).click();

});

When("I deselect a likert option", async function() {

    await this.likertControlFormSelector.locator("text=deselect").click();


});
