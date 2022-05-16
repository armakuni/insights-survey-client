
export async function installFakeAPI(world) {

    const tempSurveys = {};

    await world.context.route("**/surveys", (route, request) => {

        if (request.method() === "POST") {

            const { selfUrl, body } = newSurvey(request);
            route.fulfill({
                status: 201,
                headers: {
                    "Content-Type": "application/hal+json",
                    "Location": selfUrl.toString()
                },
                body: JSON.stringify(body)
            });

        } else {

            route.fulfill({ status: 404 });

        }


    });

    await world.context.route("**/surveys/**", (route, request) => {

        const method = request.method();
        const url = request.url();
        if (method === "POST") {

            world.apiSubmission = JSON.parse(route.request().postData());
            route.fulfill({ body: world.apiSubmission, status: 200, headers: { "Content-Type": "application/json" } });

        } else if (method === "GET" && url.endsWith("/form")) {

            route.continue();

        } else if (method === "GET" && url.match(/surveys\/[^/]*$/)) {

            const sid = /surveys\/([^/]*)$/.exec(url)[1];
            if (sid in tempSurveys) {

                route.fulfill({ body: JSON.stringify(tempSurveys[sid]), status: 200, headers: { "Content-Type": "application/hal+json" } });

            } else {

                route.fulfill({ body: "Not found", status: 404 });

            }

        } else if (method==="PUT" ) {

            const matchSurvey =/surveys\/([^/]*)$/.exec(url);
            const sid = matchSurvey[1];
            if (matchSurvey) {

                const { selfUrl, body } = newSurvey(request, sid);
                route.fulfill({
                    status: 200,
                    headers: {
                        "Content-Type": "application/hal+json",
                        "Location": selfUrl.toString()
                    },
                    body: JSON.stringify(body)
                });

            } else {

                route.fulfill({ body: "Not found", status: 404 });

            }

        }

    });


    function newSurvey(request, surveyId) {

        const body = request.postDataJSON();
        surveyId = surveyId || Date.now();
        const url = request.url();
        const selfUrl = new URL(url);
        selfUrl.pathname += `/${surveyId}`;

        const formUrl = new URL(selfUrl);
        formUrl.pathname = "/form.html";
        formUrl.searchParams.set("sid", surveyId);

        const submissions = new URL(selfUrl);
        submissions.pathname += "/submissions";

        body.metadata.id = surveyId;
        body.metadata._links = {
            form: { href: formUrl.href },
            submissions: { href: submissions.href }
        };
        tempSurveys[surveyId] = body;
        return { selfUrl, body };

    }

}
