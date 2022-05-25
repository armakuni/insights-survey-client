import { html } from "../../js/render.js";
import Likert from "./Likert.js";

function renderQuestionControls(question) {

    switch (question?.type) {

        case "likert":

            return html`<${Likert} ...${question} />`;

        default:

            return html`<aside class="error">

                <div class="title">Unknown configuration type</div>
                <pre>${JSON.stringify(question)}</pre>

            </aside>`;

    }

}

export default function Question(question) {

    return html`<div class="question ${question.name}">

        ${renderQuestionControls(question)}

    </div>`;

}
