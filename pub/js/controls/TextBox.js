import { html, fakeId } from "../render.js";
import { ensureStyleSheet } from "../styles.js";
import QuestionHeading from "./QuestionHeading.js";

ensureStyleSheet(import.meta.url);

function ReadOnly({ name, values }) {

    return html`
        <div class="response-value">"${values[name]}"</div>
    `;

}

function Editable({ name }) {

    name = name || `textbox_${Math.random().toString().substring(2)}`;
    return html`
        <textarea name="${name}" />
    `;

}

export default function TextBox(props) {

    return html`

        <fieldset class="text-box ${props.metadata?.readonly ? `readonly` : ``}">
            <${QuestionHeading} ...${props} />
            ${props.metadata?.readonly
                ? html`<${ReadOnly} ...${props} />`
                : html`<${Editable} ...${props} />`}
        </fieldset>

    `;

}
