describe('Full Test', () =>
{
  // Reset DBs.
  it('resets shop and warehouse DB.', () => {
    cy.request('GET', 'http://localhost:3000/reset')
    cy.request('GET', 'http://localhost:3100/reset')
  })

  // Add a palette.
  it('Add a palette with skateboard', () => {
    cy.visit('http://localhost:4200/store-tasks/add-palette')
    cy.contains('Store new palette:')
    cy.get('#barcodeInput').type('cy001')
    cy.get('#productInput').type('skateboard')
    cy.get('#amountInput').type('2')
    cy.get('#locationInput').type('shelf001')

    cy.get('#addPalette').click()
    cy.get('#cy001').contains(/^2$/) // INFO TYPED palette amount 2 here.
    cy.get('#cy001').contains('skateboard')
    cy.get('#cy001').contains('shelf001')
  })

  // Administritative page.
  it('Add Offer for skateboard', () => {
    cy.wait(1000)
    cy.visit('http://localhost:4400/home')
    cy.get("#go-shopping-button").click()
    cy.wait(1000)
    cy.contains("Offers overview:")
    cy.get('#edit-button').click()
    cy.wait(1000)
    cy.get('#name').type('skateboard')
    cy.get('#price').type('88')
    cy.get('#submitOfferButton').click()
    cy.contains("Offers overview:")
  })

  it('Select and Order skateboard', () => {
    cy.wait(1000)
    cy.visit('http://localhost:4400')
    cy.wait(1000)
    cy.contains("skateboard").click()
    cy.contains("Order details:")
    cy.get('#orderInput')
    cy.get("#customerInput").type("Mehdi")
    cy.get("#addressInput").type("Unter der Brücke 1")
    cy.get("#submitOrderButton").click()

    cy.contains('Mehdi')
    cy.contains('Your order for skateboard is/are in state: order placed')
  })

  it("Check product amount decremented", () => {
    cy.contains("Greetings Mehdi, you have 1 active orders!")
    cy.contains("We offer 1")
  })

  it('Select Pick Tasks', () => {
    // cy.wait(2000)
    cy.visit('http://localhost:4200/pick-tasks')
    cy.contains('Pick Tasks:')
    cy.wait(2000)
    cy.contains('skateboard').click()
    cy.get('#location-form').type("shelf001")
    cy.get('#location-form').clear()
    cy.get('#location-form').type("shelf00")
    cy.get('#location-form').type("1")
    cy.contains("Edit-Pick:")
    cy.wait(250)
    cy.get("#submitPickTaskButton").click()
  })

  it('Check status updated pickTask', () => {
    cy.contains('picking')
  })

  it('Check if palette amount decremented', () => {
    cy.wait(1000)
    cy.visit('http://localhost:4200/store-tasks')
    cy.contains(/^1$/) // TODO Check with regex
  })

  it('Check Customer Status update to picked', () => {
    cy.wait(2000)
    cy.visit('http://localhost:4400/home/Mehdi')
    cy.contains('Your order for skateboard is/are in state: picking')
  })


})
