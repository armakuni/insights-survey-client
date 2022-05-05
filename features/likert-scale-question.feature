Feature: A likert-scale question form control

    Scenario: Display a basic control with labelled ends
        Given I placed a likert-scale question on the page
            | startLabel          | endLabel         |
            | No - definitely not | Yes - absolutely |
        Then the likert-scale should have five options
        And the likert-scale's start label should be "No - definitely not"
        And the likert-scale's end label should be "Yes - absolutely"

    Scenario: Value per option of the scale
        Given I placed a likert-scale question on the page
            |  |
        When I select likert option <OPTION>
        Then the value of the likert scale is <VALUE>

        Examples:
            | OPTION | VALUE |
            | 1      | -2    |
            | 3      | 0     |
            | 5      | 2     |

    Scenario: Cardinality and labels
        Given I placed a likert-scale question on the page
            | name                   | labels                                                                                                            | cardinality |
            | failure_causes_enquiry | Strongly disagree, Disagree, Somewhat disagree, Neither agree nor disagree, Somewhat agree, Agree, Strongly agree | 9           |
        Then the likert-scale should have nine options
        And the likert-scale's start label should be "Strongly disagree"
        And the likert-scale's end label should be "9"
        And the likert-scale's seventh label should be "Strongly agree"

    Scenario: Cardinality and value
        Given I placed a likert-scale question on the page
            | cardinality |
            | 11          |
        When I select likert option 3
        Then the value of the likert scale is -3
        And the likert-scale's seventh label should be "7"

    Scenario: Default value
        Given I placed a likert-scale question on the page
            |  |
        Then the value of the likert-scale is unset

    Scenario: Unselect value
        Given I placed a likert-scale question on the page
            |  |
        When I select likert option 3
        And I deselect a likert option
        Then the value of the likert-scale is unset
