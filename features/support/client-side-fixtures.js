export async function renderSurvey(container, { config, name }) {

    const { renderSurvey } = await import("./js/main.js");
    const { submissionHandler } = await import("./js/storage/local.js");
    renderSurvey(container, config, submissionHandler({ name }));

}

export async function fetchSurveySubmission({ name }) {

    const { submissionFetcher } = await import("./js/storage/local.js");
    return await submissionFetcher({ name });

}
