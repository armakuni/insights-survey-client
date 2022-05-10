import { html } from "../render.js";
import { ensureStyleSheet, ensureStyleSheetLoaded } from "../styles.js";

const Option = ({ value, label, name }) => html`

    <input type="radio" name="${name}" value="${value}" id="${name}_${value}" />
    <label for="${name}_${value}">${label}</label>

`;

const OtherOption = ({ name }) => html`

    <input type="radio" name="${name}" id="${name}_other" value="other" />
    <label for="${name}_other">Other</label>
    <input type="text" class="likert-other" id="${name}_other-text" name="${name}_other-text" />

`;

function buildOptions({ labels, name, cardinality = 5, allowOther }) {

    name = name || `likert_${Math.random().toString().substring(2)}`;
    const ret = [];
    const offset = Math.floor(cardinality / 2) * -1;
    for(let i = 0; i < cardinality; i++) {

        const value = i + offset;
        const label = (labels && labels[i]) ?? String(i + 1);
        ret.push(Option({ value, label, name }));

    }
    if(allowOther) {

        ret.push(OtherOption({ name }));

    }
    return ret;

}


export default props => {

    ensureStyleSheet(import.meta.url);


    function handleDeselectClick(e) {

        for(const input of e.target.parentElement.querySelectorAll("input"))
            input.checked = false;

    }

    return html`

        <fieldset class="likert">
            ${buildOptions(props)}
            <button type="button" onClick=${handleDeselectClick}>deselect</button>
        </fieldset>

    `;

}

export async function preloadStyles() {

    await ensureStyleSheetLoaded(import.meta.url);

}
