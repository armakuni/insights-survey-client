import { html, useRef, useEffect } from "../../../js/render.js";
import { ensureStyleSheet } from "../../../js/styles.js";

ensureStyleSheet(import.meta.url);

export default ({ err }) => {

    const dialog = useRef();
    useEffect(() => dialog.current.showModal(), []);

    return html`

    <dialog ref=${dialog} class="err-dialog">

        <form method="dialog">
            <button>Close</button>
        </form>
        ${err.message}

    </dialog>

    `;

};
