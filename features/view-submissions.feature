Feature: View submissions
    As a survey administrator
    I want to eyeball the submissions for a survey
    So I can check how many submissions I have, and inspect some of the data

    Scenario: View list of surveys
        Given two surveys have been configured
        When I view the list of surveys
        Then the two configured surveys should be listed
