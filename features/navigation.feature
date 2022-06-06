Feature: Navigation
    As an insights administrator
    I want to navigate between different aspects of the system
    So that I can carry out different tasks

    Scenario: Navigate to question bank
        When I navigate to questions
        Then the questions area is loaded

    Scenario: Navigate to surveys
        When I navigate to surveys
        Then the survey area is loaded
