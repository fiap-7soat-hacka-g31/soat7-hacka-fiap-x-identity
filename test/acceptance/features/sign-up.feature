@FiapXIdentity
Feature: User Sign Up
  Allows users to register in the app.

  Scenario: 
    Given a new user wants to register
    When the user places his signup request
    Then the user is signed up
    And an access token is returned