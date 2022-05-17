export function submissionHandler({ survey, config, client  }) {

    return async formData => {

        const data = {
            survey,
            values: Object.fromEntries(formData.entries()),
            metadata: { created: new Date().toISOString() },
            client,
            config
        };
        localStorage.setItem(survey.id, JSON.stringify(data));

    }

}

export async function submissionFetcher({ survey }) {

    const json = localStorage.getItem(survey.id);
    return json && JSON.parse(json);

}
