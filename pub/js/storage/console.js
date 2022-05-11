export function submissionHandler({ name }) {

    return async formData => {

        console.group("Survey submission for", name, "on", new Date().toISOString());
        for(let entry of formData.entries()) {
            console.log(entry);
        }
        console.groupEnd();

    };

}
