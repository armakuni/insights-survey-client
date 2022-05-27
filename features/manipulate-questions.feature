Feature: Manipulate questions
    As a survey administrator
    I want to manipulate the question library
    So I can have questions to add to surveys

    Scenario: View list of questions
        Given 2 questions have been configured
        When I view the list of questions
        Then the two configured questions should be listed
