import SubmitSurvey from "./controls/SubmitSurvey.js";
import { html, render } from "./render.js";
import { submissionHandler } from "./storage/http.js";
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

export async function loadAndRenderSurvey(container, surveyUrl) {

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!container)
        throw new Error("The first parameter should be the container element. The survey will be rendered as HTML inside this container.");

    try {

        const fetched = await fetch(`${surveyUrl}`);
        if (!fetched.ok) {

            const err = new Error("Failed to retrieve survey");
            err.resp = fetched;
            throw err;

        }
        const survey = await fetched.json();
        const endpoint = buildSubmissionsUrl(survey);
        const handler = submissionHandler({ endpoint, survey });

        await renderSurvey(container, survey, handler);

    } catch (err) {

        await renderHelp(container, err);

    } finally {

        container.classList.add("loaded");

    }

}

function buildSubmissionsUrl(survey) {
    try {

        return survey._links.submissions.href;

    } catch(err) {

        throw new Error("Failed to find submissions link in survey");

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

export async function renderHelp(container, err) {

    const resp = err.resp;
    const help = html`

        <article class="help">

            <header>
                Survey not found
            </header>
            <div>

                <p>We're sorry but we were unable to identify the survey you're looking for.</p>

                <details>
                    <summary>Technical details</summary>
                    <p>${err.stack}</p>
                    ${resp ? `The URL we attempted to load the survey from was: ${resp.url}` : ""}
                </details>

            </div>

        </article>

    `;
    await render(help, container);
    container.classList.remove("loading");

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
