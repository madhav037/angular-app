/// <reference types="cypress" />

describe('login', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('http://localhost:4200/login');
  });

  it('displays validation errors for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Please enter a valid email address.').should('be.visible');
    cy.contains('Password is Required').should('be.visible');
  });

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', '**/Auth/login', {
      statusCode: 200,
      body: {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJuYW1laWQiOiIxIiwiZW1haWwiOiJtYWRoYXZAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiZXhwIjoyNTM0MDY0MDAwfQ.' +
          'fake-signature',
      },
    }).as('loginRequest');

    cy.intercept('GET', '**/Auth/me', {
      statusCode: 200,
      body: {
        id: 1,
        email: 'madhav@gmail.com',
        role: 'Admin',
      },
    }).as('me');

    // cy.intercept('POST', '**/Auth/refresh', {
    //   statusCode: 200,
    //   body: {
    //     accessToken: 'newAccessToken',
    //   },
    //   headers: {
    //     'X-Remember-Me': 'true',
    //   }
    // }).as('refreshToken');

    cy.get('input[formControlName="email"]').type('madhav@gmail.com');
    cy.get('input[formControlName="password"]').type('123@Madhav');
    cy.get('input[formControlName="rememberMe"]').check();

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.wait('@me').its('response.statusCode').should('eq', 200);
    // cy.wait('@refreshToken').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/dashboard');
  });

  it('should show error on invalid login', () => {
    cy.intercept('POST', '**/Auth/login', {
      statusCode: 401,
    });

    cy.get('input[formcontrolname="email"]').type('wrong@test.com');
    cy.get('input[formcontrolname="password"]').type('wrongpass');

    cy.get('button[type="submit"]').click();
    cy.contains('Invalid email or password');
  });
});
