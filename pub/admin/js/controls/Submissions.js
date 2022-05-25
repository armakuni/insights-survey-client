import { html, useContext } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";
import UIContext from "../UIContext.js";
import { navigateInClient } from "../navigate.js";
import { toISOString, toDayTimeString } from "../dates.js";

ensureStyleSheet(import.meta.url);

const UnviewSubmissionsLink = () => {

    const url = new URL(location.href);
    url.searchParams.delete("view-subs");
    return html`<a onClick=${navigateInClient} class="close" href="${url.href}"><span class="text">Close</span></a>`;

}

const DetailLink = ({ metadata }) => {

    const url = new URL(location.href);
    url.searchParams.set("view-sub", metadata.id);
    return html`<a onClick=${navigateInClient} href="${url.href}">Detail</a>`;

}

function Submission({ submission, subId }) {
    return html`
        <li class="submission ${submission?.metadata?.id === subId ? "selected" : ""}">
            <time datetime="${toISOString(submission?.metadata?.created)}">
                ${toDayTimeString(submission?.metadata?.created) ?? "Unknown date"}
            </time>
            <span class="metadata">
                <span>Id</span>
                <span>${submission?.metadata?.id || "???"}</span>
                <span>User</span>
                <span>${submission?.client?.id || "???"}</span>
            </span>
            <${DetailLink} ...${submission} />
        </li>
    `;
}

const PopulatedSubmissionsList = (submissions, subId) => html`
    <ul>
        ${submissions.map(s => html`
            <${Submission} submission=${s} subId=${subId} />
        `)}
    </ul>
`;

const EmptySubmissionsList = () => html`<div class="empty">No submissions</div>`;

const SubmissionsList = (data, subId) => data?.submissions?.length
    ? PopulatedSubmissionsList(sortSubmissions(data.submissions), subId)
    : EmptySubmissionsList()

const SubmissionsError = err => html`<article class="error">${err.stack}</article>`;

const Submissions = ({ data, err }, subId) => err ? SubmissionsError(err) : SubmissionsList(data, subId);

function sortSubmissions(data) {

    return data.sort((a, b) => a?.metadata?.created > b?.metadata?.created ? -1 : 1);

}

export default ({ surveys, submissions }) => {

    if(surveys?.data) {

        const UI = useContext(UIContext);
        const survey = surveys.data.find(x => x.id === UI.sid);
        const subId = UI.viewSubmission;
        if(UI.viewSubmissions) {

            return html`<article class="submissions ${submissions?.mode}">

                <header>${survey?.title || survey?.id} <${UnviewSubmissionsLink} /></header>
                ${submissions?.mode === "loaded" ? Submissions(submissions, subId) : html`<div class="spinner" />`}

            </article>`;

        }

    }

}
