const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const config = require('config');

const db = {
  products: [
    {
      id: uuid.v4(),
      image: 'box-brownies.jpeg',
      name: 'Product 1',
      description: 'Some type of description here',
      price: 12
    },
    {
      id: uuid.v4(),
      image: 'box-brownies.jpeg',
      name: 'Product 2',
      description: 'Some type of description here',
      price: 20
    },
    {
      id: uuid.v4(),
      image: 'box-brownies.jpeg',
      name: 'Product 3',
      description: 'Some type of description here',
      price: 30
    }
  ],
  users: [
    {
      id: uuid.v4(),
      account: {
        firstName: 'Leo',
        lastName: 'Ramirez',
        address: 'Place 123 blvd.',
        city: 'Zeeland',
        state: 'Michigan',
        zipCode: '43765',
        email: 'test1@gmail.com',
        password: '$2b$10$L8hgSohtauYT68gtz8v40e.mKw4TzV7VcjT/0y4p6q9FB9Nv7h0Xy'
      },
      orders: [],
      isAdmin: true
    },
    {
      id: uuid.v4(),
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
      orders: [],
      isAdmin: false
    }
  ]
};

function generateAuthToken(id) {
  return jwt.sign({ id: id }, config.get('secretKey'));
}

module.exports.db = db;
module.exports.generateAuthToken = generateAuthToken;
