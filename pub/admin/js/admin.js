import { render, html, useState, useEffect } from "../../js/render.js";
import UIContext, { buildState as buildUIContextState } from "./UIContext.js";

import { fetchJSON } from "../../js/json.js";
import SurveyList from "./controls/SurveyList.js";
import Submissions from "./controls/Submissions.js";
import SubmissionDetail from "./controls/SubmissionDetail.js";
import { navigateInClient } from "./navigate.js";
import QuestionList from "./controls/QuestionList.js";

export async function loadAndRenderAdminUI(container, { surveysUrl, questionsUrl }) {

    try {

        const surveys = await fetchJSON(surveysUrl);
        if(surveys.data) surveys.data.sort((x, y) => ((x.title || x.id) > (y.title || y.id)) ? 1 : -1);
        return renderAdminUI(container, { surveys, questionsUrl });

    } finally {

        container.classList.remove("loading");

    }

}

async function loadThings(href, things) {

    const fetched = await fetch(href);
    if(fetched.ok)
        return fetched.json();
    else {

        const err = Error(`Failed to load ${things}`);
        err.resp = fetched;
        throw err;

    }
}

export async function renderAdminUI(container, { surveys, questionsUrl }) {

    if(!questionsUrl)
        throw new Error("Missing questions URL: questionsUrl");

    try {

        render(
            html`<${App} surveys=${surveys} questionsUrl=${questionsUrl} />`,
            container
        );
        container.classList.add("loaded");

    } catch(err) {

        console.error(err);

    }

}

function App({ surveys, questionsUrl }) {

    const [UI, setUI] = useState(buildUIContextState());
    const [submissions, setSubmissions] = useState({});
    const [questions, setQuestions] = useState({});

    useEffect(() => {

        const mutateUIState = () => setUI(buildUIContextState());
        window.addEventListener("navigate-in-client", mutateUIState);
        window.addEventListener("popstate", mutateUIState);
        return () => {
            window.removeEventListener("navigate-in-client", mutateUIState);
            window.removeEventListener("popstate", mutateUIState);
        };

    });

    if(submissions?.sid !== UI.sid)
        setSubmissions({ sid: UI.sid });

    if(UI.viewQuestions && !questions.mode) {

        setQuestions({ mode: "loading" });
        loadThings(questionsUrl.href, "questions")
            .then(data => setQuestions({ ...questions, mode: "loaded", data }))
            .catch(err => setQuestions({ ...questions, mode: "loaded", err }));

    }

    if(UI.sid && !submissions.mode) {

        const survey = surveys?.data?.find(s => s.id === UI.sid);
        const submissionsHref = survey?._links?.submissions?.href;
        setSubmissions({ mode: "loading", sid: UI.sid });
        loadThings(submissionsHref, "submissions")
            .then(data => setSubmissions({ ...submissions, mode: "loaded", data, sid: UI.sid }))
            .catch(err => setSubmissions({ ...submissions, mode: "loaded", err, sid: UI.sid }));

    }

    return html`

        <${UIContext.Provider} value=${UI}>

            <${SurveyList} surveys=${surveys} />
            <${Submissions} surveys=${surveys} submissions=${submissions} />
            <${SubmissionDetail} submissions=${submissions} />

            <${QuestionList} questions=${questions} />

        <//>

    `;

}

const QuestionsLink = () => {

    const url = new URL(location.href);
    url.searchParams.set("view-questions", 1);
    return html`<a onClick=${navigateInClient} href="${url.href}">Questions</a>`;

}

export async function renderMenuUI(container) {

    const content = html`
        <${QuestionsLink} />
    `;
    render(content, container);

}
