/**
 * describes what the test should do. We can now write test in typescript because we have specified that in tsconfig.json.
 */


describe('Warehouse Test', () => {
  // Each it is ont test.
  it('visits the warehouse frontend', () => {
    cy.visit('http://localhost:4200/')
    // cy.contains("") // TODO hätte man hinzufügen müssen.
  })

  it("clicks on store-tasks", () => {
    cy.get("#store-tasks-button").click() // selector by id. # signifies that we look for something by id.
    cy.contains('Warehouse Palettes:')
  })

  it("click on the add palette button", () => {
    cy.get('#add-button').click()
    cy.contains('Store new palette:')
  })

  it('adds palette cy01', () => {
    cy.get('#barcodeInput').type('cy01')
    cy.get('#productInput').type('red shoes')
    cy.get('#amountInput').type('6')
    cy.get('#locationInput').type('front row')
    cy.get('#addPalette').click()

    cy.get('#cy01').contains('6')
    cy.get('#cy01').contains('red shoes')
    cy.get('#cy01').contains('front row')
  })
})
