import SubmitSurvey from "./controls/SubmitSurvey.js";
import { html, render } from "./render.js";
import Likert from "./controls/Likert.js";

const domContentLoading = new Promise(resolve => {

    document.addEventListener("DOMContentLoaded", resolve);
    if(document.readyState === "complete")
        resolve();

});

async function loading() {

    return await domContentLoading;

}

export async function renderSurvey(container, config, submissionHandler) {

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
    return await Promise.all(questionData.map(renderQuestion));

}

async function renderQuestion(config) {

    config = config || {};
    switch(config.type) {

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
