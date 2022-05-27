import { ensureStyleSheet } from "../../../js/styles.js";
import { useContext, html } from "../../../js/render.js";
import UIContext from "../UIContext.js";

ensureStyleSheet(import.meta.url);

const Question = ({ id, name, title }) => html`
    <li class="question">
        <span class="id">${id}</span>
        <span>${name}</span>
        <span>${title}</span>
    </li>
`;

const PopulatedQuestionsList = questions => html`
    <ul>${questions.map(q => html`<${Question} ...${q} />`)}</ul>
`;

const EmptyQuestionsList = () => html`
    <div class="empty">No questions</div>
`;

const QuestionsList = data => data?.items?.length
    ? PopulatedQuestionsList(sortQuestions(data.items))
    : EmptyQuestionsList()

const QuestionsError = err => html`
    <article class="error">${err.stack}</article>
`;

const Questions = ({ data, err }) => err ? QuestionsError(err) : QuestionsList(data);


function sortQuestions(data) {

    return data.sort((a, b) => 0);

}

export default function QuestionList({ questions }) {

    const UI = useContext(UIContext);
    if(UI.viewQuestions) {

        return html`<article class="questions ${questions?.mode || "loading"}">

            <header>Questions</header>
            ${questions?.mode === "loaded"
                ? html`<${Questions} ...${questions} />`
                : html`<div class="spinner" />`}

        </article>`;

    }

}
