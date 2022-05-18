import SubmitSurvey from "./controls/SubmitSurvey.js";
import { html, render } from "./render.js";
import { submissionHandler as buildSubmissionHandler } from "./storage/http.js";
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

            <article>

                <header>Survey</header>

                <form onSubmit=${submitSurvey.bind(this, container, submissionHandler)}>

                    ${await renderQuestions(config)}
                    <${SubmitSurvey} />

                </form>

            </article>

        `;
        await render(survey, container);

    } finally {

        container.classList.remove("loading");

    }

}

export async function loadAndRenderSurvey(container, surveyUrl) {

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
        const client = buildClient(survey);
        const config = await fetchConfig(survey);
        const submissionHandler = buildSubmissionHandler({ endpoint, survey, config, client });
        await renderSurvey(container, config, submissionHandler);

    } catch (err) {

        await renderHelp(container, err);

    } finally {

        container.classList.add("loaded");

    }

}

async function fetchConfig(survey) {

    const configUrl = survey._links?.configuration?.href;
    try {

        const fetched = await fetch(configUrl);
        return await fetched.json();

    } catch(err) {

        throw new Error(`Failed to load survey configuration from ${configUrl}. ${err.message}`);

    }

}

export function buildClient(survey) {

    const key = JSON.stringify({ client: survey.id });
    const client = storeId(key);
    client.location = location.href;
    return client;

}

function storeId(key) {
    try {
        const existing = localStorage.getItem(key);
        if(existing) return JSON.parse(existing);
    } catch(err) {
        console.warn(err);
    }
    const fresh = { id: `${Date.now()}_${Math.random().toString().substring(2)}` };
    localStorage.setItem(key, JSON.stringify(fresh));
    return fresh;
}

function buildSubmissionsUrl(survey) {
    try {

        return survey._links.submissions.href;

    } catch(err) {

        console.error(survey);
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

async function submitSurvey(container, submissionHandler, e) {

    e.preventDefault();
    const formData = new FormData(e.target);
    await submissionHandler(formData);
    const submissionComplete = html`
        <article class="submission-complete">

            Thank you. Your submission is complete.

        </article>
    `;
    await render(submissionComplete, container);

}
