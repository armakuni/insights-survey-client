Feature: Manipulate questions
    As a survey administrator
    I want to manipulate the question library
    So I can have questions to add to surveys

    Scenario: View list of questions
        Given 2 questions have been configured
        When I view the list of questions
        Then the two configured questions should be listed

    Scenario: A listed question should show you the type of question, its title and associated tags
        Given 1 question has been configured
        When I view the list of questions
        Then the question's name, title, type and tags should be shown

    Scenario: Create a text question - open the editor
        Given 1 question has been configured
        When I click to edit the question
        Then the question editing fields contain the configured values
