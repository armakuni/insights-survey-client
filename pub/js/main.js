import SubmitSurvey from "./controls/SubmitSurvey.js";
import { html, render } from "./render.js";
import Likert from "./controls/Likert.js";

const domContentLoading = new Promise(resolve => {

    document.addEventListener("DOMContentLoaded", resolve);
    if(document.readyState === "complete")
        resolve();

});

async function loading() {

    return domContentLoading;

}

export async function renderSurvey(container, config, submissionHandler) {

    if(!container) {
        throw new Error("First parameter should be the container element. The survey will be rendered as HTML inside this container.");
    }
    config = config || {};
    if (!submissionHandler) {

        throw new Error("The third parameter should be a function which receives a survey when the user chooses to submit it");

    }
    container.classList.add("loading");
    try {

        await loading();
        const survey = html`

            <form onSubmit=${submitSurvey.bind(this, submissionHandler)}>

                ${await renderQuestions(config)}
                <${SubmitSurvey} />

            </form>

        `;
        await render(survey, container);

    } finally {

        container.classList.remove("loading");

    }

}

async function renderQuestions(config) {

    const questionData = config?.questions || [];
    return Promise.all(questionData.map(renderQuestion));

}

async function renderQuestion(config, index) {

    config = { name: `question_${index}`, ...config };
    return html`
        <div class="question_${index + 1}">
            ${renderQuestionControls(config)}
        </div>
    `;

}

function renderQuestionControls(config) {

    switch (config.type) {

        case "likert":
            return html`<${Likert} ...${config} />`;
        default:
            return html`<article class="error">
                <div class="title">Unknown configuration type</div>
                <pre>${JSON.stringify(config)}</pre>
            `;
    }

}

async function submitSurvey(submissionHandler, e) {

    e.preventDefault();
    const formData = new FormData(e.target);
    await submissionHandler(formData);

}
