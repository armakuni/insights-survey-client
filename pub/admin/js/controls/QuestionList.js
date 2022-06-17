import { ensureStyleSheet } from "../../../js/styles.js";
import { useContext, html } from "../../../js/render.js";
import UIContext from "../UIContext.js";
import { navigateInClient } from "../navigate.js";
import TagList from "./TagList.js";

ensureStyleSheet(import.meta.url);


const EditQuestionLink = ({ id }) => {

    const url = new URL(location.href);
    url.searchParams.set("qid", id);
    return html`

        <a onClick=${navigateInClient} href="${url.href}">Edit</a>

    `;

}


const Question = ({ id, name, title, type, tags = [] }) => html`

    <li class="question ${type}-question" title=${`Question type: ${type}`}>

        <span class="title">
            ${title}
        </span>
        <dl>
            <dt>Id</dt>
            <dd class="id">${id}</dd>
            <dt>Type</dt>
            <dd class="type">${type}</dd>
            <dt>Name</dt>
            <dd class="name">${name}</dd>
        </dl>
        <${TagList} tags=${tags} compact />
        <div>
            <${EditQuestionLink} id=${id} />
        </div>

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

        return html`

            <article class="questions ${questions?.mode || "loading"}">

                <header>Questions</header>
                ${questions?.mode === "loaded"
                    ? html`<${Questions} ...${questions} />`
                    : html`<div class="spinner" />`}

            </article>

        `;

    }

}
