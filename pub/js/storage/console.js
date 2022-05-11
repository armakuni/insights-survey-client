export function submissionHandler({ name, survey }) {

    return async formData => {

        console.group("Survey submission for", name, "on", new Date().toISOString());
        console.log(survey);
        for(let entry of formData.entries()) {
            console.log(entry);
        }
        console.groupEnd();

    };

}
