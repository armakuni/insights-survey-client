Feature: Sequence of questions
    As a survey designer
    I want to be able to string together a sequence of questions
    So that they can be answered in order

    Scenario: Two simple questions
        Given a sequence containing two simple questions
        When I start the sequence
        Then the first question in the sequence is displayed
