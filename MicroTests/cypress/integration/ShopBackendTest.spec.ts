
describe('The Shop Backend Test', () => {
  it('visits the shop backend', () => {
    cy.visit('http://localhost:3100/')
  })

  it('resets the shop database', () => {
    cy.visit('http://localhost:3100/reset')
  })

  it('posts a first product stored event for 10 socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '11:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
      .then((respone) => {
        const product = respone.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 10);
      })
  })

  it('repeats the post without a change', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '11:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
      .then((respone) => {
        const product = respone.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 10);
      })
  })


  it('sends an update with now 18 socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '11:07',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 18,
      }
    })
      .then((respone) => {
        const product = respone.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 18);
      })
  })

  it('resets the database and sends the events in reverse order', () => {
    cy.visit('http://localhost:3100/reset');
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '11:07',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 18,
      }
    })
      .then((response) => {
        const product = response.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 18);
      });
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'productStored',
      blockId: 'black_socks',
      time: '11:04',
      tags: [],
      payload: {
        product: 'black_socks',
        amount: 10,
      }
    })
      .then((response) => {
        const product = response.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 18);
      })
  })

  it('sends an add offer for black_socks', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'addOffer',
      blockId: 'black_socks_price',
      time: '11:14',
      tags: [],
      payload: {
        product: 'black_socks',
        price: '$42',
      }
    })
      .then((response) => {
        const product = response.body;
        expect(product).have.property('product', 'black_socks')
        expect(product).have.property('amount', 18);
        expect(product).have.property('price', '$42');
      })
  })

  it('sends a place order command', () => {
    cy.request('POST', 'http://localhost:3100/event', {
      eventType: 'placeOrder',
      blockId: 'o1121',
      time: '11:21',
      tags: [],
      payload: {
        code: 'o1121',
        product: 'black_socks',
        customer: 'Carli Customer',
        address: 'Wonderland 1',
        state: 'new order',
      }
    })
      .then((response) => {
        const order = response.body;
        //console.log('place order response is \n' + JSON.stringify(order, null, 3));
        expect(order).have.property('product', 'black_socks');
        expect(order).have.property('customer', 'Carli Customer');
        expect(order).have.property('state', 'new order');
      })

    cy.request('GET', 'http://localhost:3100/query/customers')
      .then((response) => {
        const customerList: any[] = response.body;
        console.log('query customers response is \n' + JSON.stringify(customerList, null, 3));
        expect(customerList.length).gt(0);
      })
  })
})
