Feature: Submit a survey
    As a survey respondant
    I want to submit my responses
    So that the information gets sent to the survey organiser

    Scenario: There should be a submit button which I can click to submit
        Given a survey with questions
            | Type   | Title                         | Start label    | End label   |
            | likert | Are you happy with your life? | Definitely not | Absolutely! |
        When I click the submit button
        Then the response data is submitted
