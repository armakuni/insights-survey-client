import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { locatorDOM } from "../support/dom.js";
import { wordToNumber } from "../support/words.js";

Then("the likert-scale should have {word} options", async function(expected) {

    const likertOptions = this.page.locator(".likert input[type=radio]");
    const expectedNumber = wordToNumber(expected);
    await expect(likertOptions).toHaveCount(expectedNumber);

});

Then("the likert-scale's {word} label should be {string}", async function(position, expected) {

    const likertDOM = await locatorDOM(this.page.locator(".likert"));
    const options = Array.from(likertDOM.querySelectorAll("input[type=radio]"));
    const targettedOption = optionByPosition(position, options);
    const labelText = targettedOption.parentElement.querySelector(".text");
    expect(labelText.textContent).toEqual(expected);

});

Then("the value of the likert scale is {int}", async function(expected) {

    const formData = await this.likertControlFormSelector.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    const actualValue = formData[this.likertControlName];
    expect(actualValue).toEqual(String(expected));

});

Then("the value of the likert-scale is unset", async function() {

    const formData = await this.likertControlFormSelector.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    expect(this.likertControlName in formData).toBeFalsy();

});

function optionByPosition(position, options) {
    switch (position) {
        case "start":
            return options[0];
        case "end":
            return options[options.length - 1];
        default:
            return options[wordToNumber(position) - 1];
    }
}

