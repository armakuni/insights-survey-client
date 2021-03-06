[![Publish to production](https://github.com/armakuni/insights-survey-client/actions/workflows/publish-to-production.yml/badge.svg)](https://github.com/armakuni/insights-survey-client/actions/workflows/publish-to-production.yml)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=insights-client&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=insights-client)

# Insights survey client

A client for https://github.com/armakuni/insights-survey-api

# Development

**Note:** unlike many JS-based projects, this application isn't designed to use a build process for transpiling or bundling. Instead, it uses native JavaScript modules. These are served directly without any step needed to prepare the code for the browser (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

## Local run
To see the app running locally, you should:

1. Start a local copy of the API: https://github.com/armakuni/insights-survey-api (which will start on localhost:8081)
1. Start the Client test-server using: `npm run test-server`
1. Go to http://localhost:8080/admin?eid=DEV to see the UI working against the DEV endpoint (http://localhost:8081)

## Tests (against local run)
To run tests (against the test-server you started above), you can run:
1. `npm run cucumber`


## Client <-> API
The `eid` querystring variable tells the client which API ("endpoint") to run against. Well known endpoints are specified in the module: https://github.com/armakuni/insights-survey-client/blob/main/pub/js/configuration/known-endpoints.js
