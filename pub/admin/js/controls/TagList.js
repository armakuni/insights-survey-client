import { ensureStyleSheet } from "../../../js/styles.js";
import { html, useState } from "../../../js/render.js";

ensureStyleSheet(import.meta.url);

const className = classes => classes.filter(x => x).join(" ");

const Tag = ({ tag, compact, editable, checked }) => html`

    <label class="${className(["tag", compact && "compact", !checked && "unselected"])}">

        <span class="text">${tag}</span>
        ${editable && html`

            <input type="checkbox" name="tag" value=${tag} checked=${checked} />

        `}

    </label>

`;

export default function TagList({ tags = [], selectedTags, compact, editable }) {

    selectedTags = selectedTags || tags;
    return html`

        <ul class="tags">

            ${tags.map(t => html`

                <li class=${selectedTags.includes(t) && "selected"}>
                    <${Tag} tag=${t} compact=${compact} editable=${editable} checked=${selectedTags.includes(t)} />
                </li>

            `)}

        </ul>

    `;

}
