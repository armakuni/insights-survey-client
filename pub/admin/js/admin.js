import { render, html, useState, useEffect } from "../../js/render.js";
import UIContext, { buildState as buildUIContextState } from "./UIContext.js";

import { fetchJSON } from "../../js/json.js";
import SurveyList from "./controls/SurveyList.js";
import Submissions from "./controls/Submissions.js";
import SubmissionDetail from "./controls/SubmissionDetail.js";

export async function loadAndRenderAdminUI(container, surveysUrl) {

    try {

        const surveys = await fetchJSON(surveysUrl);
        if(surveys.data) surveys.data.sort((x, y) => ((x.title || x.id) > (y.title || y.id)) ? 1 : -1);
        return renderAdminUI(container, { surveys });

    } finally {

        container.classList.remove("loading");

    }

}

async function loadSubmissions(href) {

    const fetched = await fetch(href);
    if(fetched.ok)
        return fetched.json();
    else {

        const err = Error(`Failed to load submissions`);
        err.resp = fetched;
        throw err;

    }

}

export async function renderAdminUI(container, { surveys }) {

    try {

        const app = html`<${() => {

            const [UI, setUI] = useState(buildUIContextState());
            const [submissions, setSubmissions] = useState({});

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

            if(UI.sid && !submissions.mode) {

                const survey = surveys?.data?.find(s => s.id === UI.sid);
                const submissionsHref = survey._links?.submissions?.href;
                setSubmissions({ mode: "loading", sid: UI.sid });
                loadSubmissions(submissionsHref)
                    .then(data => setSubmissions({ ...submissions, mode: "loaded", data, sid: UI.sid }))
                    .catch(err => setSubmissions({ ...submissions, mode: "loaded", err, sid: UI.sid }));

            }

            return html`

                <${UIContext.Provider} value=${UI}>

                    <${SurveyList} surveys=${surveys} />
                    <${Submissions} surveys=${surveys} submissions=${submissions} />
                    <${SubmissionDetail} submissions=${submissions} />

                <//>

            `;

        }} />`;
        render(app, container);
        container.classList.add("loaded");


    } catch(err) {

        console.error(err);

    }

}
