import { html, useContext } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";
import ConfigContext from "../ConfigContext.js";
import { navigateInClient } from "../navigate.js";

ensureStyleSheet(import.meta.url);

const ViewSubmissionsLink = ({ id }) => {

    const url = new URL(location.href);
    url.searchParams.set("sid", id);
    url.searchParams.set("view-subs", 1);
    return html`<a onClick=${navigateInClient} href="${url.href}">View submissions</a>`;

}

const Links = item => html`
    <div class="links">
        ${item._links.form && html`<a target="blank" href="${item._links.form.href}">Open the response form</a>`}
        <${ViewSubmissionsLink} ...${item} />
    </div>
`;

const Title = item => html`<span class="title">${item.title || item.id}</span>`;

const Survey = (item, { sid }) => html`
    <li class="survey ${item.id === sid ? "selected" : ""}">
        <${Title} ...${item} />
        <${Links} ...${item} />
    </li>
`;

const SurveyList = ({ data, UI }) => html`<ul class="survey-list">${data.map(item => Survey(item, UI))}</ul>`;

const EmptyList = () => html`<div class="empty-survey-list">No surveys found</div>`;

export default ({ data }) => {

    if(data && data.length) {

        const UI = useContext(ConfigContext) || {};
        return SurveyList({ data, UI });

    } else {

        return EmptyList();

    }

}
