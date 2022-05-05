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
            ||
        When I select likert option <OPTION>
        Then the value of the likert scale is <VALUE>

        Examples:
            | OPTION | VALUE |
            | 1      | -2    |
            | 3      | 0     |
            | 5      | 2     |
