import { html, fakeId } from "../render.js";
import { ensureStyleSheet, ensureStyleSheetLoaded } from "../styles.js";

const Option = ({ value, label, name, id }) => html`

    <input type="radio" name="${name}" value="${value}" id="${id}" />
    <label for="${id}">${label}</label>

`;

function selectOtherOption(e) {

    const container = e.target.parentElement;
    container.querySelector("input[value=other]").checked = true;

}

const OtherOption = ({ name }) => html`

    <input type="radio" name="${name}" id="${name}_other" value="other" />
    <label for="${name}_other">Other</label>
    <input onInput=${selectOtherOption} type="text" class="likert-other" id="${name}_other-text" name="${name}_other-text" />

`;

function buildOptions({ labels, name, cardinality = 5, allowOther, questionId }) {

    name = name || `likert_${Math.random().toString().substring(2)}`;
    const ret = [];
    const offset = Math.floor(cardinality / 2) * -1;
    questionId = questionId || fakeId();
    for(let i = 0; i < cardinality; i++) {

        const value = i + offset;
        const label = (labels && labels[i]) ?? String(i + 1);
        ret.push(Option({ value, label, name, id: `${questionId}_${i}` }));

    }
    if(allowOther) {

        ret.push(OtherOption({ name }));

    }
    return ret;

}

function questionTitle({ title }) {
    if (title) {
        return html`<div class="title">${title}</div>`;
    }
    else
        return null;
}


export default props => {

    ensureStyleSheet(import.meta.url);


    function handleDeselectClick(e) {

        for(const input of e.target.parentElement.parentElement.querySelectorAll("input"))
            input.checked = false;

    }

    return html`

        <fieldset class="likert">
            ${questionTitle(props)}
            ${buildOptions(props)}
            <div class="controls">
                <button type="button" onClick=${handleDeselectClick}>deselect</button>
            </div>
        </fieldset>

    `;

}

export async function preloadStyles() {

    await ensureStyleSheetLoaded(import.meta.url);

}
