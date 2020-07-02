const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const config = require('config');

const db = {
  products: [
    {
      id: '61319c1c',
      image: 'box-brownies.jpeg',
      name: 'Product 1',
      description: 'Some type of description here',
      price: 12
    },
    {
      id: '1afa90ef',
      image: 'box-brownies.jpeg',
      name: 'Product 2',
      description: 'Some type of description here',
      price: 20
    },
    {
      id: '2ba4cf9e',
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
        email: 'admin@gmail.com',
        password:
          '$2b$10$L8hgSohtauYT68gtz8v40e.mKw4TzV7VcjT/0y4p6q9FB9Nv7h0Xy',
        shipping: {},
        billing: {}
      },
      items: [],
      isAdmin: true,
      isSubscribed: true
    }
  ],
  orders: [
    {
      invoiceId: '000000000',
      orderDescription: 'This is a description',
      account: {
        firstName: 'Leonardo',
        lastName: 'Ramirez',
        email: 'testguest@gmail.com',
        phoneNum: '(616) 777-4545',
        shipping: {
          firstName: 'Leonardo',
          lastName: 'Ramirez',
          addressOne: '706 Bliss Street Pl.',
          addressTwo: 'Apt. 1478',
          city: 'Wintersz lark',
          state: 'FL',
          zipCode: '42646',
          country: 'USA'
        },
        billing: {
          firstName: 'Leonardo',
          lastName: 'Ramirez',
          addressOne: '706 Bliss Street Pl.',
          addressTwo: 'Apt. 1478',
          city: 'Wintersz lark',
          state: 'FL',
          zipCode: '42646',
          country: 'USA',
          phoneNum: '(616) 777-4545'
        }
      },

      items: []
    }
  ]
};

function generateAuthToken(id) {
  return jwt.sign({ id: id }, config.get('secretKey'));
}

module.exports.db = db;
module.exports.generateAuthToken = generateAuthToken;
