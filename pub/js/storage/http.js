export function submissionHandler({ survey, endpoint }) {

    if (!endpoint) throw new Error("No endpoint supplied. The endpoint must be a URL which can receive POSTed survey submissions");
    if (!survey) throw new Error("No survey data supplied. Please supply survey data so that responses can be correlated against the questions which were asked.");

    return async formData => {

        const data = {
            survey,
            values: Object.fromEntries(formData.entries()),
            submission: { created: new Date().toISOString() }
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
    return async ({ metadata, questions } = {}) => {

        if (!metadata) throw new Error("No survey metadata supplied. The metadata property can optionally contain the id the survey being configured");
        if (!questions) throw new Error("No survey questions supplied. This should be a list of question objects");
        const url = new URL(endpoint, location.href);

        const isIdempotent = !!metadata.id;
        if(isIdempotent) url.pathname += `/${metadata.id}`;
        const method = isIdempotent ? "PUT" : "POST";

        const fetched = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ metadata, questions })
        });

        if(!fetched.ok) {

            const err = new Error(`Failed to store configuration`);
            err.response = fetched;
            throw err;

        }

        return await fetched.json();

    };

}
