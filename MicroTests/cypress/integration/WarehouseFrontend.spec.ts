/**
 * describes what the test should do. We can now write test in typescript because we have specified that in tsconfig.json.
 */

describe('Warehouse Test', () => {
  it('visits the warehouse frontend', () => {
    cy.visit('http://localhost:4200/')
    // cy.contains("") //
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

  // INFO Subscribe shop as listener to warehouse.
  it('subscribes the shop as listener to the warehouse', () => {
    cy.request("POST", 'http://localhost:3000/subscribe', {
      subscriberUrl: 'http://localhost:3100/event',
      lastEventTime: '0'
    })
      .then((response) => {
        const eventList = response.body;
        console.log('subscribe at warehouse respone is \n' + JSON.stringify(eventList, null, 3));
        expect(eventList.length).gt(0);
      })
  })

  it('adds another palette of red shoes', () => {
    cy.get("#add-button").click()
    cy.contains('Store new palette:')

    cy.get('#barcodeInput').type('cy02')
    cy.get('#productInput').type('red shoes')
    cy.get('#amountInput').type('24')
    cy.get('#locationInput').type('shelf 03')
    cy.get('#addPalette').click()

    cy.get('#cy02').contains('24')
    cy.get('#cy02').contains('red shoes')
    cy.get('#cy02').contains('shelf 03')

  })

})

