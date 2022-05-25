Feature: View submissions
    As a survey administrator
    I want to eyeball the submissions for a survey
    So I can check how many submissions I have, and inspect some of the data

    Scenario: View list of surveys
        Given 2 surveys have been configured
        When I view the list of surveys
        Then the two configured surveys should be listed

    Scenario: Navigate from list of surveys to survey form
        Given 1 survey has been configured
        When I view the list of surveys
        And I click the link to open the form for the configured survey
        Then the survey form opens in a new window

    Scenario: View submissions for survey
        Given 2 surveys have been configured
        And three submissions exist for configured survey 2
        When I view the list of surveys
        And I click the link to open submissions for survey 2
        Then the three submissions are displayed

    Scenario: Close submissions
        Given I openned the submissions panel
        When I click the Close icon
        Then the submissions panel is not shown

    Scenario: View individual submission
        Given I followed the response link to a pre-prepared survey with the questions
            | Name           | Type   | Title                         | Start label      | End label      |
            | life-happiness | likert | Are you happy with your life? | Definitely not   | Absolutely!    |
            | private-wealth | likert | Are you rich?                 | Completely broke | Swimming in it |
        And I have submitted the survey with responses
            | Name           | Value |
            | life-happiness | 4     |
            | private-wealth | 2     |
        And I view submissions for the pre-prepared survey
        When I open the submission detail for the submission 1
        Then it should show the metadata, questions and answers of the opened submission

