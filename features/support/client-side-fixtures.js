export async function renderSurvey(container, { config, name, api }) {

    const imports = await Promise.all([
        import("./js/main.js"),
        import("./js/storage/local.js"),
        import("./js/storage/http.js")
    ]);

    const [
        { renderSurvey: renderSurveyMain },
        { submissionHandler: localSubmissionHandler },
        { submissionHandler: httpSubmissionHandler }
    ] = imports;

    const submissionHandler = (api ? httpSubmissionHandler : localSubmissionHandler);
    const options = { name, survey: config, endpoint: api };
    renderSurveyMain(container, config, submissionHandler(options) );

}

export async function fetchSurveySubmission({ name }) {

    const { submissionFetcher } = await import("./js/storage/local.js");
    return submissionFetcher({ name });

}
