export const wellKnownSurveyEndpointId = "well-known-survey-id-37383bnjdlklikj7834774ghjhgdh";
export const wellKnownEndpointSurveyFormUrl = "/form.html?sid=well-known-survey-id-37383bnjdlklikj7834774ghjhgdh&eid=AKAPI";

export async function installFakeAPI(world) {

    if(world.fakeAPIInstalled) return;
    world.fakeAPIInstalled = true;

    const tempSurveys = {
        [wellKnownSurveyEndpointId]: {
            id: wellKnownSurveyEndpointId,
            _links: {
                submissions: { href: `/surveys/${wellKnownSurveyEndpointId}/submissions` },
                configuration: { href: `/surveys/${wellKnownSurveyEndpointId}/configuration`}
            },
            questions: [
                {
                    title: "What's your favourite number?",
                    type: "likert"
                }
            ]
        }
    };

    await world.context.route("**/surveys", (route, request) => {

        const method = request.method();
        if (method === "GET") {

            const asSurvey = s => ({ ...s, questions: undefined, submissions: undefined });
            route.fulfill({
                status: 200,
                headers: { "Content-Type": "application/hal+json" },
                body: JSON.stringify(Object.values(tempSurveys).map(asSurvey))
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
            route.fulfill({
                body: JSON.stringify(world.apiSubmission),
                status: 200,
                headers: { "Content-Type": "application/json" }
            });

        } else if (method === "GET" && url.match(/surveys\/[^/]*$/)) {

            const sid = /surveys\/([^/]*)$/.exec(url)[1];

            if(sid === wellKnownSurveyEndpointId && !url.includes("insights-survey-api"))
                throw new Error("URL is incorrectly calculated for well known endpoint survey");

            if (sid in tempSurveys) {

                const stored = JSON.parse(JSON.stringify(tempSurveys[sid]));
                delete stored.questions;
                delete stored.submissions;
                route.fulfill({ body: JSON.stringify(stored), status: 200, headers: { "Content-Type": "application/hal+json" } });

            } else {

                route.fulfill({ body: "Not found", status: 404 });

            }

        } else if (method === "GET" && url.match(/surveys\/.*\/configuration$/)) {

            const sid = /surveys\/([^/]*)/.exec(url)[1];
            if (sid in tempSurveys) {

                const survey = tempSurveys[sid];
                const config = {
                    id: sid,
                    title: survey.title,
                    questions: survey.questions
                };
                route.fulfill({ body: JSON.stringify(config), status: 200, headers: { "Content-Type": "application/hal+json" } });

            } else {

                route.fulfill({ body: "Not found", status: 404 });

            }

        } else if (method==="PUT" && url.match(/surveys\/.*\/configuration$/)) {

            const matchSurvey = /surveys\/(.*)\/configuration$/.exec(url);
            const sid = matchSurvey[1];
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

            route.continue();

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

        const configuration = new URL(selfUrl);
        configuration.pathname += "/configuration";

        body.id = surveyId;
        body._links = {
            form: { href: formUrl.href },
            submissions: { href: submissions.href },
            configuration: { href: configuration.href }
        };

        tempSurveys[surveyId] = body;

        return { selfUrl, body };

    }

}
