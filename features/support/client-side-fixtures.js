export const likertControlName = "likert-question";

export async function renderLikertControl(container, { labels, likertControlName }) {

    const { default: Likert } = await import("./js/controls/Likert.js");
    const { html, render } = await import("./js/render.js");
    render(html`

        <form>
            <${Likert} labels=${labels} name="${likertControlName}" />
        </form>

    `, container);

}
