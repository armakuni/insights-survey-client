const memos = {};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitFor(predicate, timeout, start){

    start = start || Date.now();
    while(!predicate()) {
        if(Date.now() - start > timeout)
            throw new Error(`Timed out waiting for ${predicate}`);
        await sleep(10);
    }

}

export async function ensureStyleSheetLoaded(moduleUrl) {

    const link = ensureStyleSheet(moduleUrl);
    await waitFor(() => link.hasAttribute("loaded"), 10000);

}

export function ensureStyleSheet(moduleUrl) {

    if(!findExistingElement(moduleUrl)) {

        const expectedHref = moduleUrl.replace(/\.js/, ".css");
        let link = document.querySelector(`head > link[href="${expectedHref}"]`);
        if(!link) {

            link = document.createElement("LINK");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("href", expectedHref);
            link.setAttribute("onload", "this.setAttribute('loaded',true)");
            document.head.appendChild(link);

        }
        memos[moduleUrl] = link;

    }
    return memos[moduleUrl];

}

function findExistingElement(moduleUrl) {

    const found = memos[moduleUrl];
    if (found && (found.parentElement === document.head))
        return found;

}

