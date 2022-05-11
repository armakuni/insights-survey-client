import { Given } from "@cucumber/cucumber";

function parseLikertControlConfiguration(config = {}) {

    let {
        "Start label": startLabel,
        "End label": endLabel,
        "Name": name,
        "Labels": labels,
        "Cardinality": cardinality,
        "Allow other": allowOther,
        "Title": title
    } = config

    if (labels) {

        labels = labels.split(",").map(x => (x || "").trim());

    }
    if (cardinality) {

        cardinality = Number(cardinality);

    }
    if (startLabel || endLabel) {

        labels = labels || Array.from({ length: cardinality || 5 });
        labels[0] = startLabel;
        labels[labels.length - 1] = endLabel;

    }

    allowOther = allowOther === "true";

    name = name || "likert-question";

    return { labels, name, cardinality, allowOther, title };
}

Given("I placed a likert scale question on the page", async function(dataTable) {

    const row = dataTable.hashes()[0] || {};
    const questionConfig = {
        type: "likert",
        ...parseLikertControlConfiguration(row)
    };
    this.likertControlName = questionConfig.name;
    await this.renderSurvey([ questionConfig ]);

});

Given("I placed an unconfigured likert scale question on the page", async function() {

    const questionConfig = {
        type: "likert",
        ...parseLikertControlConfiguration()
    };
    this.likertControlName = questionConfig.name;
    await this.renderSurvey([ questionConfig ]);

});

Given("a survey with questions", async function(dataTable) {

    const questions = dataTable.hashes().map(row => {

        switch(row.Type) {
            case "likert":
                return {
                    type: "likert",
                    ...parseLikertControlConfiguration(row)
                };
            default:
                throw new Error(`Unrecognised question type: ${JSON.stringify(row)}`);
        }

    });

    await this.renderSurvey(questions);

});

Given("I have selected a required likert scale question", async function() {
    return "pending";
});

Given("a sequence containing two simple questions", async function() {
    return "pending";
});
