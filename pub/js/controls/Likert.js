import { html, useState } from "../render.js";
import { ensureStyleSheet } from "../styles.js";

const Option = ({ value, label, name }) => html`

    <label>
        <input type="radio" name="${name}" value="${value}" />
        <span class="text">${label}</span>
    </label>

`;

function buildOptions({ labels, name }) {

    labels = labels || [];
    const ret = [];
    const cardinality = 5;
    const offset = Math.floor(cardinality / 2) * -1;

    for(let i = 0; i < cardinality; i++) {

        const value = i + offset;
        const label = labels[i] || "";
        ret.push(Option({ value, label, name }));

    }
    return ret;

}

export default ({ labels, name }) => {

    name = name || `likert_${Math.random().toString().substring(2)}`;
    ensureStyleSheet(import.meta.url);
    return html`

        <fieldset class="likert">
            ${buildOptions({ labels, name })}
        </fieldset>

    `;

}
