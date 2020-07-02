const express = require('express');
const { db } = require('../db');
const uuid = require('uuid');

const {
  createAnAcceptPaymentTransaction
} = require('../gatewayAPI/create-an-accept-payment-transaction');

const router = express.Router();

//POST
router.post('/', async (req, res) => {
  //deconstruct user properties
  const { account, items, dataDescriptor, dataValue } = req.body;

  const validLineItems = [];

  items.forEach((item, index) => {
    const dbItemId = [];

    //get db item ids from array of products
    db.products.forEach((dbItem) => {
      dbItemId.push(dbItem.id);
    });

    //find the index of the db item
    const dbIndex = dbItemId.indexOf(item.id);

    //validate the user item with the db item and push db item to transaction
    if (item.id === db.products[dbIndex].id) {
      const userItem = {
        ...db.products[index],
        quantity: item.quantity
      };

      validLineItems.push(userItem);
    }
  });

  const invoiceId = uuid.v4().substring(0, 8);
  const orderDescription = `${account.firstName} ${account.lastName} has ordered ${items.length} products`;

  try {
    const paymentResponse = await createAnAcceptPaymentTransaction(
      invoiceId,
      orderDescription,
      account,
      validLineItems,
      dataDescriptor,
      dataValue
    );

    //send Authrize.net payment Response
    res.send({ ...paymentResponse, orderId: invoiceId });

    //create user order
    const order = {
      invoiceId,
      orderDescription,
      account,
      items: validLineItems
    };

    db.orders.push(order);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
