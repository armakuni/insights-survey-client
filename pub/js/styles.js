const memos = {};

export function ensureStyleSheet(moduleUrl) {

    if(!findExistingElement(moduleUrl)) {

        const expectedHref = moduleUrl.replace(/\.js/, ".css");
        let link = document.querySelector(`head > link[href="${expectedHref}"]`);
        if(!link) {

            link = document.createElement("LINK");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", expectedHref);
            document.head.appendChild(link);

        }
        memos[moduleUrl] = link;

    }

}

function findExistingElement(moduleUrl) {

    const found = memos[moduleUrl];
    if (found && (found.parentElement === document.head))
        return found;

}

