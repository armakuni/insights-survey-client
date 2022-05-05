export async function renderLikertControl(container, props) {

    const { default: Likert } = await import("./js/controls/Likert.js");
    const { html, render } = await import("./js/render.js");
    render(html`

        <form>
            <${Likert} ...${props} />
        </form>

    `, container);

}
