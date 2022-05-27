import { html, useContext } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";
import UIContext from "../UIContext.js";
import { navigateInClient } from "../navigate.js";
import ErrDialog from "./ErrDialog.js";

ensureStyleSheet(import.meta.url);

const ViewSubmissionsLink = ({ id }) => {

    const url = new URL(location.href);
    url.searchParams.set("sid", id);
    url.searchParams.set("view-subs", 1);
    url.searchParams.delete("view-sub");
    return html`<a onClick=${navigateInClient} href="${url.href}">View submissions</a>`;

}

const Links = item => html`
    <div class="links">
        ${item._links.form && html`<a target="blank" href="${item._links.form.href}">Open the response form</a>`}
        <${ViewSubmissionsLink} ...${item} />
    </div>
`;

const Title = item => html`
    <span class="title">${item.title || item.id}</span>
`;

const Survey = (item, { sid }) => html`
    <li class="survey ${item.id === sid ? "selected" : ""}">
        <${Title} ...${item} />
        <${Links} ...${item} />
    </li>
`;

const PopulatedSurveys = ({ data }) => html`
    <ul class="survey-list">
        ${data.map(item => Survey(item, useContext(UIContext) || {}))}
    </ul>
`;

const EmptyList = () => html`
    <div class="empty-survey-list">No surveys found</div>
`;

export default function SurveyList({ surveys }) {

    const UI = useContext(UIContext);
    if (UI.viewSurveys) {

        return html`

            <article class="surveys">

                <header>Surveys</header>
                ${surveys.err && html`<${ErrDialog} ...${surveys} />`}
                ${surveys?.data && surveys.data.length
                    ? html`<${PopulatedSurveys} ...${surveys} />`
                    : html`<${EmptyList} />`}

            </article>

        `;

    }

}
