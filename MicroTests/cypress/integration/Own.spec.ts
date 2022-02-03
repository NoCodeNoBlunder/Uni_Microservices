describe('Shop Test', () =>
{
  it('resets shop and warehouse DB.', () => {
    cy.request('GET', 'http://localhost:3000/reset')
    cy.request('GET', 'http://localhost:3100/reset')
  })

  it('Go to Warehouse store-tasks/add-palette', () => {
    cy.visit('http://localhost:4200/store-tasks/add-palette')
    cy.contains('Store new palette:')
  })

  it('Add one palette', () => {
    cy.get('#barcodeInput').type('cy001')
    cy.get('#productInput').type('skateboard')
    cy.get('#amountInput').type('6')
    cy.get('#locationInput').type('front row')

    cy.get('#addPalette').click()
    cy.get('#cy001').contains('6')
    cy.get('#cy001').contains('skateboard')
    cy.get('#cy001').contains('front row')
  })

  it('Add Offer', () => {
    cy.visit('http://localhost:4400/home')
    cy.wait(500)
    cy.get("#go-shopping-button").click()
    cy.get('#add-button').click()
    cy.contains('Edit Offer:')
    cy.get('#name').type('skateboard')
    cy.get('#price').type('88')
    cy.get('#submitOfferButton').click()
    cy.contains("Offers overview:")
  })

  it('Click on Product Link', () => {
    cy.visit('http://localhost:4400')
    cy.contains("skateboard").click()
    cy.contains("Order details:")
    cy.get('#orderInput')
    cy.get("#addressInput").type("Unter der Brücke 1")
    cy.get("#customerInput").type("Mehdi")
    cy.get("#submitOrderButton").click()

    cy.contains('Mehdi')
    cy.contains('Your skateboard are in state order placed')
  })

  it('Check Pick Tasks', () => {
    cy.wait(500)
    cy.visit('http://localhost:4200/pick-tasks')
    cy.contains('Pick Tasks:')
    cy.contains('skateboard')
  })
})
