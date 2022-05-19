import { render, html, useState, useEffect } from "../../js/render.js";
import ConfigContext from "./ConfigContext.js";

import { fetchJSON } from "../../js/json.js";
import ErrDialog from "./controls/ErrDialog.js";
import SurveyList from "./controls/SurveyList.js";
import Submissions from "./controls/Submissions.js";

export async function loadAndRenderAdminUI(container, surveysUrl) {

    try {

        const surveys = await fetchJSON(surveysUrl);
        surveys.data.sort((x, y) => ((x.title || x.id) > (y.title || y.id)) ? 1 : -1);
        return renderAdminUI(container, { surveys });

    } finally {

        container.classList.remove("loading");

    }

}

function buildUIState() {

    const url = new URL(location.href);
    return {
        sid: url.searchParams.get("sid"),
        viewSubmissions: !!url.searchParams.get("view-subs")
    };

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

            const [UI, setUI] = useState(buildUIState());
            const [submissions, setSubmissions] = useState({});

            useEffect(() => {

                const mutateUIState = () => setUI(buildUIState());
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

                <${ConfigContext.Provider} value=${UI}>

                    <article class="surveys">

                        <header>Surveys</header>
                        ${surveys.err && html`<${ErrDialog} ...${surveys} />`}
                        <${SurveyList} ...${surveys} />

                    </article>
                    <${Submissions} surveys=${surveys} submissions=${submissions} />

                <//>

            `;

        }} />`;
        render(app, container);
        container.classList.add("loaded");


    } catch(err) {

        console.error(err);

    }

}
