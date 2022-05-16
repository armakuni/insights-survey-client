import { render, html } from "../js/render.js";

document.addEventListener("DOMContentLoaded", () => {

    const header = document.body.querySelector(".design-system-header");
    if(header)
        render(html`
            <nav>
                <a href="likert.html">Likert control</a>
                <a href="main.html">Submission</a>
                <a href="../form.html">Live form</a>
            </nav>
        `, header);

});
