import { When } from "@cucumber/cucumber";

When("I select likert option {int}", async function(int_0) {

    await this.likertControlFormSelector.locator(`:nth-match(input[type=radio], ${int_0})`).click();

});
