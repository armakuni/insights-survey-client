Feature: Submit a survey
    As a survey respondant
    I want to submit my responses
    So that the information gets sent to the survey organiser

    Scenario: There should be a submit button which I can click to submit
        Given a survey with questions
            | Name           | Type   | Title                         | Start label    | End label   |
            | life-happiness | likert | Are you happy with your life? | Definitely not | Absolutely! |
        When I click the submit button
        Then the response data is submitted

    Scenario: Inspect submitted survey
        Given a survey with questions
            | Name           | Type   | Title                         | Start label    | End label   |
            | life-happiness | likert | Are you happy with your life? | Definitely not | Absolutely! |
        When I choose option 2 for survey question 1
        And I click the submit button
        Then the response data includes the following results
            | Question | Value |
            | 1        | -1    |

    Scenario: Submit a survey via API
        Given the submission handler is an API
        Given a survey with questions
            | Name           | Type   | Title                         | Start label    | End label   |
            | life-happiness | likert | Are you happy with your life? | Definitely not | Absolutely! |
        When I choose option 4 for survey question 1
        And I click the submit button
        Then the response data is submitted to the API
