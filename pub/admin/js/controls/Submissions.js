import { html, useContext, useState } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";
import ConfigContext from "../ConfigContext.js";
import { navigateInClient } from "../navigate.js";

ensureStyleSheet(import.meta.url);

const UnviewSubmissionsLink = () => {

    const url = new URL(location.href);
    url.searchParams.delete("view-subs");
    return html`<a onClick=${navigateInClient} class="close" href="${url.href}">Close</a>`;

}

export default ({ surveys, submissions }) => {


    if(surveys?.data) {

        const UI = useContext(ConfigContext);
        const survey = surveys.data.find(x => x.id === UI.sid);
        if(UI.viewSubmissions) {

            return html`<article class="submissions ${submissions?.mode}">

                <header>${survey?.title || survey?.id} <${UnviewSubmissionsLink} /></header>
                ${JSON.stringify(submissions)}

            </article>`;

        }

    }

}
