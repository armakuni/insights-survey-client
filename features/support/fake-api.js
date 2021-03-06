export const wellKnownSurveyEndpointId = "well-known-survey-id-37383bnjdlklikj7834774ghjhgdh";
export const wellKnownEndpointSurveyFormUrl = "/form.html?sid=well-known-survey-id-37383bnjdlklikj7834774ghjhgdh&eid=AKAPI";

function fulfillWithHAL(obj, route, headers = {}) {

    route.fulfill({
        body: JSON.stringify(obj),
        status: 200,
        headers: { ...headers, "Content-Type": "application/hal+json" }
    });

}

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

    const tempQuestions = {

    }

    await world.context.route("**/surveys", (route, request) => {

        const method = request.method();
        if (method === "GET") {

            const asSurvey = s => ({ ...s, questions: undefined, submissions: undefined });
            fulfillWithHAL(Object.values(tempSurveys).map(asSurvey), route);

        } else {

            route.fulfill({ status: 404 });

        }


    });

    await world.context.route("**/surveys/**", (route, request) => {

        const method = request.method();
        const url = request.url();

        const sid = /surveys\/([^/]*)/.exec(url)[1];
        const survey = tempSurveys[sid];

        if (method === "POST") {

            const parsedSubmission = JSON.parse(route.request().postData());
            parsedSubmission.metadata = parsedSubmission.metadata || {};
            parsedSubmission.metadata.id = `sid::${sid}_cid::${parsedSubmission.client?.id}`;

            world.apiSubmission = parsedSubmission;

            if(survey) {

                survey.submissions = survey.submissions || [];
                survey.submissions.push(JSON.parse(JSON.stringify(parsedSubmission)));

            }

            route.fulfill({
                body: JSON.stringify(world.apiSubmission),
                status: 200,
                headers: { "Content-Type": "application/json" }
            });

        } else if (method === "GET") {

            if(survey && url.match(/surveys\/.*\/configuration$/))
                return fulfillWithHAL({
                    id: sid,
                    title: survey.title,
                    questions: survey.questions
                }, route);
            else if(survey && url.match(/surveys\/.*\/submissions$/))
                return fulfillWithHAL({
                    id: sid,
                    submissions: survey.submissions
                }, route);
            else if(survey) {

                if(sid === wellKnownSurveyEndpointId && !url.includes("insights-survey-api"))
                    throw new Error("URL is incorrectly calculated for well known endpoint survey");

                const stored = JSON.parse(JSON.stringify(tempSurveys[sid]));
                delete stored.questions;
                delete stored.submissions;
                return fulfillWithHAL(stored, route);

            }
            route.fulfill({ body: "Not found", status: 404 });

        } else if (method==="PUT" && url.match(/surveys\/.*\/configuration$/)) {

            const { selfUrl, body } = newSurvey(request, sid);
            fulfillWithHAL(body, route, { Location: selfUrl.toString() });

        } else {

            route.continue();

        }

    });


    function newSurvey(request, surveyId) {

        const body = request.postDataJSON();
        surveyId = surveyId || Date.now();
        const url = new URL(request.url());
        if(url.pathname.endsWith("/configuration"))
            url.pathname = url.pathname.replace(/\/configuration/, "");

        const selfUrl = new URL(url);
        selfUrl.pathname += `/${surveyId}`;

        const formUrl = new URL(url);
        formUrl.pathname = "/form.html";
        formUrl.searchParams.set("sid", surveyId);

        const submissions = new URL(url);
        submissions.pathname += "/submissions";

        const configuration = new URL(url);
        configuration.pathname += "/configuration";

        body.id = surveyId;
        body._links = {
            form: { href: formUrl.href },
            submissions: { href: submissions.href },
            configuration: { href: configuration.href },
        };

        tempSurveys[surveyId] = body;

        return { selfUrl, body };

    }

    await world.context.route("**/questions", (route, request) => {

        const method = request.method();
        const url = request.url();

        if (method ==="GET" && url.match(/\/questions$/)) {

            const body = { items: Object.values(tempQuestions) };
            fulfillWithHAL(body, route );

        } else {

            route.continue();

        }

    });

    await world.context.route("**/questions/**", (route, request) => {

        const method = request.method();
        const url = request.url();

        const qid = /questions\/([^/]*)/.exec(url)[1];
        const question = tempQuestions[qid];

        if (method==="PUT" && url.match(/questions\/.*\/configuration$/)) {

            const body = request.postDataJSON();
            tempQuestions[qid] = body;
            fulfillWithHAL(body, route, { Location: url });

        } else {

            route.continue();

        }

    });

}
