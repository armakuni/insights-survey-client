import { ensureStyleSheet } from "../../../js/styles.js";
import { useContext, useState, html } from "../../../js/render.js";
import UIContext from "../UIContext.js";
import { navigateInClient } from "../navigate.js";
import TagList from "./TagList.js";

ensureStyleSheet(import.meta.url);

function CancelLink() {

    const url = new URL(location.href);
    url.searchParams.delete("qid");
    return html`

        <a onClick=${navigateInClient} href="${url.href}">Cancel</a>

    `;

}


async function handleSubmission(e) {

    e.preventDefault();
    const formData = new FormData(e.target);
    console.log(JSON.stringify(Object.fromEntries(formData.entries())));
    throw new Error("Not implemented");

}

function EditQuestion({ question }) {

    const { id } = question;
    const [ selectedTags, setSelectedTags] = useState(question.tags);
    console.log("Selected tags", selectedTags);

    function handleInput(e){

        const formData = new FormData(e.currentTarget);
        const tags = formData.getAll("tag");
        setTimeout(() => {

            if(selectedTags.length != tags.length || !selectedTags.every(t => t.includes(t)))
                setSelectedTags(tags);

        }, 10);

    }

    return html`

        <form onSubmit=${handleSubmission} onInput=${handleInput}>

            <label for=${`${id}_title`}>Title</label>
            <input id=${`${id}_title`} type="text" name="title" value=${question.title} />

            <label for=${`${id}_name`}>Name</label>
            <input id=${`${id}_name`} type="text" name="name" value=${question.name} />

            <label for=${`${id}_type`}>Question type</label>
            <select name="type" id=${`${id}_type`} value=${question.type}>
                <option value="likert">Likert scale</option>
                <option value="text">Text</option>
            </select>

            <span>Tags</span>
            <${TagList} tags=${question.tags} selectedTags=${selectedTags} editable />

            <div class="controls">
                <input type="submit">Save</input>
                <${CancelLink} />
            </div>

        </form>

    `;

}
export default function QuestionEditor({ questions }) {

    const UI = useContext(UIContext);
    if(UI.qid) {

        const item = questions?.data?.items?.find(q => q.id === UI.qid);
        return html`

            <article class="question-editor ${questions?.mode || "loading"}">

                <header>Edit question</header>
                ${questions?.mode === "loaded"
                    ? html`<${EditQuestion} key=${UI.qid} question=${item} />`
                    : html`<div class="spinner" />`}


            </article>

        `;

    }

}
