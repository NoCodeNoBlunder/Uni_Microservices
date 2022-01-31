describe('Shop Test', () =>
{
  it('visits the shop frontend', () => {
    cy.visit('http://localhost:4400/offer-tasks') // INFO Go to administritative page.
  })

  // it('clicks on offer-tasks', () => {
  //   cy.get('#offer-tasks-button').click()
  //   cy.contains('Offers overview:')
  // })

  it('clicks on the Edit button', () => {
    cy.get('#add-button').click()
    cy.contains('Edit Offer:')
  })

  it('sets the price of jeans to 42.99', () => {
    cy.get('#name').type('jeans')
    cy.get('#price').type('forty')
    cy.get('#submitOfferButton').click()

    cy.contains('Edit Offer:')

    cy.get('#price').clear()
    cy.get('#price').type('42.99')
    cy.get('#submitOfferButton').click()
    cy.contains("Offers overview:")
  })

  it('validates the jeans price in the database', () => {
    cy.request('GET', 'http://localhost:3100/query/product-jeans')
      .then((response) => {
        const product: any = response.body;
        console.log('query jeans got \n' + JSON.stringify(product, null, 3));
        expect(product.price).equal('42.99');
      })
  })

  it("sets the price of tshirts to 9.99", () => {
    cy.visit('http://localhost:4400/offer-tasks')
    cy.get('#add-button').click()
    cy.contains("Edit Offer:")
    // TODO productNameInput name or prodcutNameInput
    cy.get("#name").type('tshirt')
    cy.get("#price").type("9.99")
    cy.get("#submitOfferButton").click()
    cy.contains("Offers overview:")
  })

  it("starts shopping", () => {
    cy.visit("http://localhost:4400")
  })

  it("clicks on jeans", () => {
    cy.contains("jeans").click()
    cy.contains("Order details:")
    cy.get('#orderInput').clear().type("o_001")
    cy.get("#addressInput").type("Wonderland 1")
    cy.get("#customerInput").type("Carli")
    cy.get("#submitOrderButton").click()

    cy.contains('Hello Carli')
    cy.contains('Your jeans are in state order placed')
  })

  it('visit the warehouse frontend', () => {
    cy.visit('http://localhost:4200')
  })

  it('clicks on the Pic Tasks button', () => {
    cy.get('#pick-tasks-button').click()
    cy.contains('Pick Tasks:')
    cy.contains('jeans').click()
  })

  it('pick jeans from shelf 03', () => {
    cy.get('#locationInput').type('shelf 03')
    cy.get('#doneButton').click()
    cy.contains('Pick Tasks:')
  })

  it('checks that carli is informed', () => {
    cy.visit('http://localhost:4400/home/Carli')
  })
})
