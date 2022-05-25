import { html } from "../render.js";
import { ensureStyleSheet } from "../styles.js";

ensureStyleSheet(import.meta.url);

export default function QuestionHeading(question) {

    return html`<header>

        ${question?.metadata?.number && html`<span class="number">${question?.metadata?.number || ""}</span>`}
        <span class="title">${question?.title || ""}</span>

    </header>`;

}
