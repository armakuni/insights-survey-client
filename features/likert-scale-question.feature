Feature: A likert-scale question form control

    Scenario: Display a basic control with labelled ends
        When I place a likert-scale question on the page
            | startLabel          | endLabel         |
            | No - definitely not | Yes - absolutely |
        Then the likert-scale should have five options
        And the likert-scale's start label should be "No - definitely not"
        And the likert-scale's end label should be "Yes - absolutely"
