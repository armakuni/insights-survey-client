import { ensureStyleSheetLoaded, ensureStyleSheet } from "../styles.js";
import { html } from "../render.js";

export default () => {

    ensureStyleSheet(import.meta.url);

    return html`

        <input type="submit" value="Submit" />

    `;

}

export async function preloadStyles() {

    await ensureStyleSheetLoaded(import.meta.url);

}
