// integration/app.spec.js

describe('Navigation', () => {
  it('should navigate to the pool page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // Find a link with an href attribute containing "pool" and click it
    cy.get('a[href*="pool"]').click()

    // The new url should include "/pool"
    cy.url().should('include', '/pool')

    // The new page should contain an h1 with "My Liquidity Positions page"
    cy.get('h1').contains('My Liquidity Positions')
  })
})
