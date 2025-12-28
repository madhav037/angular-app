/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
Cypress.Commands.add('loginAsAdmin', () => {
  cy.intercept('POST', '**/Auth/login', {
    statusCode: 200,
    body: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwiZW1haWwiOiJtYWRoYXZAZ21haWwuY29tIiwidW5pcXVlX25hbWUiOiJNYWRoYXYiLCJyb2xlIjoiQWRtaW4iLCJqdGkiOiI5ZWU1NjQ2NC0wNjIzLTQ5ZDktYWVlNi1mNDI5MWUyMDAyZmMiLCJuYmYiOjE3NjY3MzQyMjQsImV4cCI6MTc2NjczNDI4NCwiaWF0IjoxNzY2NzM0MjI0LCJpc3MiOiJEZW1vTVMiLCJhdWQiOiJEZW1vTVNVc2VycyJ9.V6mvM3XmjALU2pDJInCfRsEoytJnXLz-jaVZvpmVVEw',
    },
  });

  cy.intercept('GET', '**/Auth/me', {
    statusCode: 200,
    body: {
      id: 1,
      email: 'madhav@gmail.com',
      role: 'Admin',
    },
  });

  cy.visit('http://localhost:4200/login');

  cy.get('input[formcontrolname="email"]').type('madhav@gmail.com');
  cy.get('input[formcontrolname="password"]').type('123@Madhav');
  cy.get('button[type="submit"]').click();

  cy.url().should('include', '/dashboard');
});
