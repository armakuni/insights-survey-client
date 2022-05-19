import { html, useContext } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";
import ConfigContext from "../ConfigContext.js";
import { navigateInClient } from "../navigate.js";
import { toISOString, toDayTimeString } from "../dates.js";

ensureStyleSheet(import.meta.url);

const UnviewSubmissionsLink = () => {

    const url = new URL(location.href);
    url.searchParams.delete("view-subs");
    return html`<a onClick=${navigateInClient} class="close" href="${url.href}"><span class="text">Close</span></a>`;

}

const Submission = submission => html`<li class="submission">
    <time datetime="${toISOString(submission?.metadata?.created)}">${toDayTimeString(submission?.metadata?.created) ?? "Unknown date"}</time>
</li>`;

const PopulatedSubmissionsList = submissions => html`<ul>${submissions.map(Submission)}</ul>`;

const EmptySubmissionsList = () => html`<div class="empty">No submissions</div>`;

const SubmissionsList = data => data?.submissions?.length
    ? PopulatedSubmissionsList(sortSubmissions(data.submissions))
    : EmptySubmissionsList()

const SubmissionsError = err => html`<article class="error">${err.stack}</article>`;

const Submissions = ({ data, err }) => err ? SubmissionsError(err) : SubmissionsList(data);

function sortSubmissions(data) {

    return data.sort((a, b) => a?.metadata?.created > b?.metadata?.created ? -1 : 1);

}

export default ({ surveys, submissions }) => {

    if(surveys?.data) {

        const UI = useContext(ConfigContext);
        const survey = surveys.data.find(x => x.id === UI.sid);
        if(UI.viewSubmissions) {

            return html`<article class="submissions ${submissions?.mode}">

                <header>${survey?.title || survey?.id} <${UnviewSubmissionsLink} /></header>
                ${submissions?.mode === "loaded" ? Submissions(submissions) : html`<div class="spinner" />`}

            </article>`;

        }

    }

}
