import { html, useState } from "../render.js";
import { ensureStyleSheet } from "../styles.js";

const Option = ({ value, label, name }) => html`

    <label>
        <input type="radio" name="${name}" value="${value}" />
        <span class="text">${label}</span>
    </label>

`;

function buildOptions({ labels, name, cardinality = 5 }) {

    name = name || `likert_${Math.random().toString().substring(2)}`;
    const ret = [];
    const offset = Math.floor(cardinality / 2) * -1;
    for(let i = 0; i < cardinality; i++) {

        const value = i + offset;
        const label = (labels && labels[i]) ?? String(i + 1);
        ret.push(Option({ value, label, name }));

    }
    return ret;

}

export default props => {

    ensureStyleSheet(import.meta.url);
    return html`

        <fieldset class="likert">
            ${buildOptions(props)}
        </fieldset>

    `;

}
