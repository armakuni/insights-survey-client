import { html } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";

ensureStyleSheet(import.meta.url);

const Survey = item => html`<li class="survey">${item.title || item.id}</li>`;

const SurveyList = ({ data }) => html`<ul class="survey-list">${data.map(Survey)}</ul>`;

const EmptyList = () => html`<div class="empty-survey-list">No surveys</div>`;

export default ({ data }) => html`<${data ? SurveyList : EmptyList} ...${{ data }} />`;

