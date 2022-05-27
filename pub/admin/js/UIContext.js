import { createContext } from "../../js/render.js";

const context = createContext();
export default context;

export function buildState() {

    const url = new URL(location.href);
    const searchParams = url.searchParams;
    const viewQuestions = !!searchParams.get("view-questions");
    const viewSurveys = !viewQuestions;
    return JSON.parse(JSON.stringify({
        sid: searchParams.get("sid"),
        viewSubmissions: viewSurveys && !!searchParams.get("view-subs"),
        viewSubmission: viewSurveys && searchParams.has("view-sub") ? searchParams.get("view-sub") : undefined,
        viewQuestions,
        viewSurveys
    }));

}
