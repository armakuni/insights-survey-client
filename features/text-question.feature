Feature: A text question form control
    As a survey creator
    I want to be able to use a text question
    So that I can capture responses in free form

    Scenario: A basic control
        Given I placed a text box question on the page
        When I enter the text "it's all good"
        Then the value of the text box is "it's all good"

    Scenario: Default value should be nothing
        Given I placed a text box question on the page
        Then the value of the text box is empty
