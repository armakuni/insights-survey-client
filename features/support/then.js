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

    function optionByPosition(position, labels) {
        switch (position) {
            case "start":
                return labels[0];
            case "end":
                return labels[labels.length - 1];
            default:
                return labels[wordToNumber(position) - 1];
        }
    }

    const likertDOM = await locatorDOM(this.page.locator(".likert"));
    const labels = Array.from(likertDOM.querySelectorAll("label"));
    const targettedOption = optionByPosition(position, labels);
    expect(targettedOption.textContent).toEqual(expected);

});

Then("the value of the likert scale is {int}", async function(expected) {

    const formData = await this.likertControlFormSelector.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    const actualValue = formData[this.likertControlName];
    expect(actualValue).toEqual(String(expected));

});


Then("the value of the likert scale is {string}", async function(expected) {

    const formData = await this.likertControlFormSelector.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    const actualValue = formData[this.likertControlName];
    expect(actualValue).toEqual(expected);

});

Then("the value of the likert scale is unset", async function() {

    const formData = await this.likertControlFormSelector.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    expect(this.likertControlName in formData).toBeFalsy();

});

Then("the value of the likert scale's other option text is {string}", async function(expected) {

    const formData = await this.likertControlFormSelector.evaluate(form => Object.fromEntries(new FormData(form).entries()));
    const actualValue = formData[`${this.likertControlName}_other-text`];
    expect(actualValue).toEqual(expected);


});
