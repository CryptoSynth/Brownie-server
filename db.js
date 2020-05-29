const uuid = require('uuid');

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
  ]
};

module.exports = db;
