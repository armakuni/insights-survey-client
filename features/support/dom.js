import { JSDOM } from "jsdom";

export default () => new JSDOM(`<!DOCTYPE html><html><head><head><body></body></html>`).window;

export async function locatorDOM(locator) {

    const dom = new JSDOM(`<!DOCTYPE html><html><head><head><body></body></html>`);
    dom.window.document.body.innerHTML = await locator.innerHTML();
    return dom.window.document.body;

}
