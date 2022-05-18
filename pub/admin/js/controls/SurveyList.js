import { html } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";

ensureStyleSheet(import.meta.url);

const Links = links => links.form && html`<a target="blank" href="${links.form.href}">Open the response form</a>`;

const Title = item => html`<span class="title">${item.title || item.id}</span>`;

const Survey = item => html`
    <li class="survey">
        <${Title} ...${item} />
        <${Links} ...${item._links} />
    </li>
`;

const SurveyList = ({ data }) => html`<ul class="survey-list">${data.map(Survey)}</ul>`;

const EmptyList = () => html`<div class="empty-survey-list">No surveys found</div>`;

export default ({ data }) => html`<${(data && data.length) ? SurveyList : EmptyList} ...${{ data }} />`;

