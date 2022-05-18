import { render, html } from "../../js/render.js";
import { fetchJSON } from "../../js/json.js";
import ErrDialog from "./controls/ErrDialog.js";
import SurveyList from "./controls/SurveyList.js";

export async function loadAndRenderAdminUI(container, surveysUrl) {

    try {

        const surveys = await fetchJSON(surveysUrl);
        surveys.data.sort((x, y) => ((x.title || x.id) > (y.title || y.id)) ? 1 : -1);
        return renderAdminUI(container, { surveys });

    } finally {

        container.classList.remove("loading");

    }

}

export async function renderAdminUI(container, { surveys }) {

    try {

        const bits = html`
            <article>
                <header>Surveys</header>
                ${surveys.err && html`<${ErrDialog} ...${surveys} />`}
                <${SurveyList} ...${surveys} />
            </article>
        `;
        render(bits, container);
        container.classList.add("loaded");

    } catch(err) {

        console.error(err);

    }

}
