export function submissionHandler({ name, survey }) {

    return async formData => {

        const data = {
            survey,
            values: Object.fromEntries(formData.entries()),
            submission: { created: new Date().toISOString() }
        };
        localStorage.setItem(name, JSON.stringify(data));

    }
}

export async function submissionFetcher({ name }) {

    const json = localStorage.getItem(name);
    return json && JSON.parse(json);

}
