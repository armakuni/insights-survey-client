import { html, fakeId } from "../render.js";
import { ensureStyleSheet, ensureStyleSheetLoaded } from "../styles.js";
import QuestionHeading from "./QuestionHeading.js";
ensureStyleSheet(import.meta.url);

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
    const offset = calculateValueOffset({ cardinality });
    questionId = questionId || fakeId();
    for(let i = 0; i < cardinality; i++) {

        const value = i + offset;
        const label = labelByIndex({ labels }, i);
        ret.push(Option({ value, label, name, id: `${questionId}_${i}` }));

    }
    if(allowOther) {

        ret.push(OtherOption({ name }));

    }
    return ret;

}

function labelByIndex({ labels }, i) {
    return (labels && labels[i]) ?? String(i + 1);
}

function calculateValueOffset({ cardinality }) {
    return Math.floor(cardinality / 2) * -1;
}

function ReadOnly({ cardinality = 5, name, values, labels = [] }) {

    const value = values[name];
    const offset = calculateValueOffset({ cardinality });
    const startLabel = labelByIndex({ labels }, 0);
    const endLabel = labelByIndex({ labels }, cardinality - 1);
    const startScale = `"${startLabel}" ${offset.toString()}`.trim();
    const endScale = `"${endLabel}" ${(offset + cardinality - 1).toString()}`;
    const valueText = labelByIndex({ labels }, value - offset);
    return html`
    <details>
        <summary>
            <span class="response-text">"${valueText}"</span>
            (<span class="response-value">${value}</span>)
        </summary>
        <div>
            <div class="response-scale">On a scale: ${startScale} ...to... ${endScale}</div>
        </div>
    </details>
    `;

}

function Editable(props) {

    function handleDeselectClick(e) {

        for(const input of e.target.parentElement.parentElement.querySelectorAll("input"))
            input.checked = false;

    }

    return html`
        <div class="controls">
            <button type="button" onClick=${handleDeselectClick}>deselect</button>
        </div>
        ${buildOptions(props)}
    `;

}

export default function Likert(props) {

    return html`

        <fieldset class="likert ${props.metadata?.readonly ? `readonly` : ``}">
            <${QuestionHeading} ...${props} />
            ${props.metadata?.readonly
                ? html`<${ReadOnly} ...${props} />`
                : html`<${Editable} ...${props} />`}
        </fieldset>

    `;

}

export async function preloadStyles() {

    await ensureStyleSheetLoaded(import.meta.url);

}
