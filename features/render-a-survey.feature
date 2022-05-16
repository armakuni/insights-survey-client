Feature: Submit a survey
    As a survey creator
    I want to send out a URL which will render my survey
    So that respondants can use it to submit their response

    Scenario: Survey's response page should render the survey form
        Given I follow the response link to a pre-prepared survey with the questions
            | Name           | Type   | Title                         | Start label    | End label   |
            | life-happiness | likert | Are you happy with your life? | Definitely not | Absolutely! |
        When I choose option 3 for survey question 1
        And I click the submit button
        Then the response data is submitted to the API for the pre-prepared survey

    Scenario: If a survey isn't found, help should be shown
        Given I follow a broken response link to a survey
        Then help about a survey not being found is shown

    Scenario: If a well-known endpoint is specified, then it should be used to retrieve the survey
        Given I follow a response link to a well-known named survey endpoint
        Then the survey should be rendered as expected
