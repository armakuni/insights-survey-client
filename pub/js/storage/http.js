export function submissionHandler({ name, survey, endpoint }) {

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
