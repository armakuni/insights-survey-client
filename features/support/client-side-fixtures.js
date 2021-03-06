export async function renderSurvey(container, { config, api }) {

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
        survey: { id: config.id },
        endpoint: api,
        client: buildClient(config),
        config
    };
    renderSurveyMain(container, config, submissionHandler(options) );

}

export async function fetchSurveySubmission({ survey }) {

    const { submissionFetcher } = await import("./js/storage/local.js");
    return submissionFetcher({ survey });

}

export async function configureSurvey({ config, api }) {

    const { storeConfiguration } = await import("./js/storage/http.js");
    return storeConfiguration({ endpoint: api })(config);

}

export async function configureQuestion({ config, api }) {

    const { storeQuestionConfiguration } = await import("./js/storage/http.js");
    return storeQuestionConfiguration({ endpoint: api })(config);

}

export async function createSubmissions({ survey, config, endpoint, submissionCount }) {

    const { submissionHandler } = await import("./js/storage/http.js");
    const added = [];
    for(let i = 0; i < submissionCount; i++) {
        const handler = submissionHandler({
            survey,
            endpoint,
            config,
            client: { id: `Client_${i}` }
        });
        const data = new FormData();
        data.set("hello", "world");
        added.push(await handler(data));
    }
    return added;

}

export async function createSubmissionsWithResponses({ survey, config, endpoint, responsesForSubmissions }) {

    const { submissionHandler } = await import("./js/storage/http.js");
    const added = [];
    for(let i = 0; i < responsesForSubmissions.length; i++) {

        const handler = submissionHandler({
            survey,
            endpoint,
            config,
            client: { id: `Client_${i}` }
        });

        const data = new FormData();
        const submissionResponses = responsesForSubmissions[i];
        for(let { name, value } of submissionResponses) {

            data.set(name, value);

        }

        added.push(await handler(data));

    }
    return added;

}
