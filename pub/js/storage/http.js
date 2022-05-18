export function submissionHandler({ survey, endpoint, config, client }) {

    if (!endpoint) throw new Error("No endpoint supplied. The endpoint must be a URL which can receive POSTed survey submissions");
    if (!survey) throw new Error("No survey data supplied. Please supply survey data so that responses can be correlated against the questions which were asked.");
    if (!client) throw new Error("No client data provided. The client data should include an id to enable repeated submission of the same survey response.");

    return async formData => {

        const data = {
            survey,
            values: Object.fromEntries(formData.entries()),
            metadata: { created: new Date().toISOString() },
            client,
            config
        };
        await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

    };

}

export function storeConfiguration({ endpoint } = {}) {

    if (!endpoint) throw new Error("No endpoint supplied. The endpoint must be a URL which can received POSTed/PUTed survey definitions");
    return async config => {

        if (!config.questions) throw new Error("No survey questions supplied. This should be a list of question objects");
        if (!config.id) throw new Error("No survey id supplied");

        const fetched = await fetch(endpoint, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        });

        if(!fetched.ok) {

            const err = new Error(`Failed to store configuration`);
            err.response = fetched;
            throw err;

        }

        return await fetched.json();

    };

}
