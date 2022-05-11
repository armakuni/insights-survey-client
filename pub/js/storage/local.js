export function submissionHandler({ name }) {

    return async formData => {

        const data = {
            values: formData,
            submission: { created: new Date().toISOString() }
        };
        localStorage.setItem(name, JSON.stringify(data));

    }
}

export async function submissionFetcher({ name }) {

    const json = localStorage.getItem(name);
    return json && JSON.parse(json);

}
