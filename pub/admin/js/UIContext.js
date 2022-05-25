import { createContext } from "../../js/render.js";

const context = createContext();
export default context;

export function buildState() {

    const url = new URL(location.href);
    const searchParams = url.searchParams;
    return JSON.parse(JSON.stringify({
        sid: searchParams.get("sid"),
        viewSubmissions: !!searchParams.get("view-subs"),
        viewSubmission: searchParams.has("view-sub") ? searchParams.get("view-sub") : undefined
    }));

}
