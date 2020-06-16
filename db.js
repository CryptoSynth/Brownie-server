const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const config = require('config');

const db = {
  products: [
    {
      id: uuid.v4().substr(0, 8),
      image: 'box-brownies.jpeg',
      name: 'Product 1',
      description: 'Some type of description here',
      price: 12
    },
    {
      id: uuid.v4().substr(0, 8),
      image: 'box-brownies.jpeg',
      name: 'Product 2',
      description: 'Some type of description here',
      price: 20
    },
    {
      id: uuid.v4().substr(0, 8),
      image: 'box-brownies.jpeg',
      name: 'Product 3',
      description: 'Some type of description here',
      price: 30
    }
  ],
  users: [
    {
      id: '0bb0deb0-94fb-480f-a60a-16444b9f9f6c',
      account: {
        firstName: 'Leo',
        lastName: 'Ramirez',
        address: 'Place 123 blvd.',
        city: 'Zeeland',
        state: 'Michigan',
        zipCode: '43765',
        email: 'admin@gmail.com',
        password: '$2b$10$L8hgSohtauYT68gtz8v40e.mKw4TzV7VcjT/0y4p6q9FB9Nv7h0Xy'
      },
      order: {
        invoiceId: '0bb0deb0',
        description: 'Order description here',
        tax: {
          name: 'level2 tax name',
          description: 'level2 tax here',
          amount: '6.12'
        },
        shipping: {
          name: 'shipping name',
          description: 'shipping description here',
          amount: '10'
        },
        items: []
      },
      isAdmin: true
    },
    {
      id: '0bb0deb0-94fb-480f-a60a-16444b9f9f6c',
      account: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        email: 'test2@gmail.com',
        password: '$2b$10$L8hgSohtauYT68gtz8v40e.mKw4TzV7VcjT/0y4p6q9FB9Nv7h0Xy'
      },
      order: {
        invoiceId: '0bb0deb0',
        description: 'Order description here',
        tax: {
          name: 'level2 tax name',
          description: 'level2 tax here',
          amount: '6.12'
        },
        duty: {
          name: 'duty name',
          description: 'duty description here',
          amount: '8.55'
        },
        shipping: {
          name: 'shipping name',
          description: 'shipping description here',
          amount: '10'
        },
        items: []
      },
      isAdmin: false
    }
  ]
};

function generateAuthToken(id) {
  return jwt.sign({ id: id }, config.get('secretKey'));
}

module.exports.db = db;
module.exports.generateAuthToken = generateAuthToken;
