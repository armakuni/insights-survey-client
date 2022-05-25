import { html, useContext } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";
import UIContext from "../UIContext.js";
import { navigateInClient } from "../navigate.js";
import { toISOString, toDayTimeString } from "../dates.js";
import Question from "../../../js/controls/Question.js";

ensureStyleSheet(import.meta.url);

const UnviewSubmissionLink = () => {

    const url = new URL(location.href);
    url.searchParams.delete("view-sub");
    return html`<a onClick=${navigateInClient} class="close" href="${url.href}"><span class="text">Close</span></a>`;

}

function ensureName(question, index) {
    const data = { ...question };
    data.name = data.name || `question_${index}`;
    return data;
}

const Submission = ({ metadata, values, client, config }) => html`

<div class="body">
    <span class="metadata">
        <span>Id</span>
        <span>${metadata?.id || "???"}</span>
        <span>User</span>
        <span>${client?.id || "???"}</span>
    </span>
    ${config?.questions?.map(ensureName).map((q, i) => html
        `<${Question} ...${q} metadata=${{ readonly: true, number: i + 1 }} values=${values} />`
    )}
</div>

`;

export default ({ submissions }) => {

    const UI = useContext(UIContext);
    if(UI.viewSubmission) {

        const submission = submissions?.data?.submissions?.find(s => s.metadata?.id === UI.viewSubmission);
        return html`<article class="submission ${submissions?.mode}">

            <header>
                <time datetime="${toISOString(submission?.metadata?.created)}">
                    ${toDayTimeString(submission?.metadata?.created) ?? "Unknown date"}
                </time>
                <${UnviewSubmissionLink} />
            </header>
            ${submissions?.mode === "loaded"
                ? html`<${Submission} ...${submission} />`
                : html`<div class="spinner" />`}

        </article>`;

    }

}
