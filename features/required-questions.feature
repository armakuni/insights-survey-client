Feature: Required questions
    As a survey creator
    I want to be able to configure certain questions as required
    So that users must complete them

    Scenario: Required likert scale
        Given I have selected a required likert scale question
        When I attempt to progress to the next section
        Then progressing is blocked with a message "This is a required question"
