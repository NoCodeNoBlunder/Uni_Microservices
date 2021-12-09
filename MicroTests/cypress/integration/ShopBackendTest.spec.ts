
describe('The Shop Backend Test', () => {
  it('visits the shop backend', () => {
    cy.visit('http://localhost:3100/')
  })

  it('resets the shop database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('posts a product stored event', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
      // This operation is called as soon as the reponse returns basically an old fashioned await.
      // This is done via a lamba expression which gets passed the reponse as the argument.
      .then((respone) => {
        const product = respone.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 10);
      })
  })

  // INFO This event doesn not change anything because the timestamp is not more recent.
  it('repeats the post without a change', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks', // INFO Since this blockId is already in the database and the time is not more recent.
      time: '12:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 22,
      }
    })
      .then((respone) => {
        const product = respone.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 10);
      })
  })

  it('sends an update with another 20 socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '12:05',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 20,
      }
    })
      .then((response) => {
        // console.log(JSON.stringify(response, null, 3));

        const product = response.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 30);
      })
  })

  it('sends an add offer for black_socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',  // INFO only the price gets added. Or updated with this event type.
      blockId: 'black_socks_price',
      time: '12:14',
      tags: [],
      payload: {
        product: 'black_socks',
        price: '$42',
      }
    }).then((response) => {
      const product = response.body;
      expect(product).have.property('product', 'black_socks')
      expect(product).have.property('amount', 30);
      expect(product).have.property('price', '$42');
    })
  })

  it('sends an place order command', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'placeOrder',
      blockId: 'o1121',
      time: '12:21',
      tags: [],
      payload: {
        code: '01121',
        product: 'black_socks',
        customer: "Carli Customer",
        address: 'Wonderland 1',
        state: 'new order',
      }
    })
    .then((respone) => {
      const order = respone.body;
      expect(order).have.property('product', 'black_socks');
      expect(order).have.property('customer', 'Carli Customer');
      expect(order).have.property('state', 'new order')
    })

    cy.request('GET', 'http://localhost:3100/query/customers')
    .then((response) => {
      const customerList: any[] = response.body;
      console.log('query customers reponse is \n' + JSON.stringify(customerList, null, 3));
      expect(customerList.length).gt(0); // we want the customersList.lenght be bigger than 0.
    })
  })

////////////// Own Tests /////////////////

  it('Demonstrate StoreEvent Dummy Element.', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',  // INFO only the price gets added. Or updated with this event type.
      blockId: 'iPhone X',
      time: '15:00',
      tags: [],
      payload: {
        product: 'iPhone X',
        price: '$999',
      }
    }).then((response) => {
      const product = response.body;
      expect(product).have.property('price', '$999');
    })
  })

  // TODO this makes no sense. The offer with less money was accepted.
  it('Override price to lower price.', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',  // INFO only the price gets added. Or updated with this event type.
      blockId: 'iPhone X',
      time: '15:01',
      tags: [],
      payload: {
        product: 'iPhone X',
        price: '$1',
      }
    }).then((response) => {
      const product = response.body;
      expect(product).have.property('price', '$1');
    })
  })
})
