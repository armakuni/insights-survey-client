Feature: A likert scale question form control

    Scenario: Display a basic control with labelled ends
        Given I placed a likert scale question on the page
            | startLabel          | endLabel         |
            | No - definitely not | Yes - absolutely |
        Then the likert scale has five options
        And the likert scale's start label is "No - definitely not"
        And the likert scale's end label is "Yes - absolutely"

    Scenario: Value per option of the scale
        Given I placed a likert scale question on the page
            |  |
        When I select likert option <OPTION>
        Then the value of the likert scale is <VALUE>

        Examples:
            | OPTION | VALUE |
            | 1      | -2    |
            | 3      | 0     |
            | 5      | 2     |

    Scenario: Cardinality and labels
        Given I placed a likert scale question on the page
            | name                   | labels                                                                                                            | cardinality |
            | failure_causes_enquiry | Strongly disagree, Disagree, Somewhat disagree, Neither agree nor disagree, Somewhat agree, Agree, Strongly agree | 9           |
        Then the likert scale has nine options
        And the likert scale's start label is "Strongly disagree"
        And the likert scale's end label is "9"
        And the likert scale's seventh label is "Strongly agree"

    Scenario: Cardinality and value
        Given I placed a likert scale question on the page
            | cardinality |
            | 11          |
        When I select likert option 3
        Then the value of the likert scale is -3
        And the likert scale's seventh label is "7"

    Scenario: Default value should be nothing
        Given I placed a likert scale question on the page
            |  |
        Then the value of the likert scale is unset

    Scenario: It should be possible to get back to the state where no value is selected
        Given I placed a likert scale question on the page
            |  |
        When I select likert option 3
        And I deselect a likert option
        Then the value of the likert scale is unset

    Scenario: There should be an "other" option
        Given I placed a likert scale question on the page
            | allowOther |
            | true       |
        When I select the "other" likert option
        And I enter a value of "I'm a snowflake" in the likert other option text box
        Then the value of the likert scale is "other"
        And the value of the likert scale's other option text is "I'm a snowflake"

    Scenario: Clicking the "Other" option text box should also select the other option
        Given I placed a likert scale question on the page
            | allowOther |
            | true       |
        When I enter a value of "hello" in the likert other option text box
        Then the value of the likert scale is "other"
