export async function renderSurvey(container, { config, name, api }) {

    const imports = await Promise.all([
        import("./js/main.js"),
        import("./js/storage/local.js"),
        import("./js/storage/http.js")
    ]);

    const [
        { renderSurvey: renderSurveyMain, buildClient },
        { submissionHandler: localSubmissionHandler },
        { submissionHandler: httpSubmissionHandler }
    ] = imports;

    const submissionHandler = (api ? httpSubmissionHandler : localSubmissionHandler);
    const options = {
        name,
        survey: config,
        endpoint: api,
        client: buildClient(config)
    };
    renderSurveyMain(container, config, submissionHandler(options) );

}

export async function fetchSurveySubmission({ name }) {

    const { submissionFetcher } = await import("./js/storage/local.js");
    return submissionFetcher({ name });

}

export async function configureSurvey({ config, api }) {

    const { storeConfiguration } = await import("./js/storage/http.js");
    return await storeConfiguration({ endpoint: api })(config);

}
