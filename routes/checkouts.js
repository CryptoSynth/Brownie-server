const express = require('express');
const { db } = require('../db');

const {
  createAnAcceptPaymentTransaction
} = require('../gatewayAPI/create-an-accept-payment-transaction');

const router = express.Router();

//POST
router.post('/', async (req, res) => {
  //deconstruct user properties
  const { id, lineItems, dataDescriptor, dataValue } = req.body;

  const user = db.users.find((user) => user.id === id);

  if (!user) return res.status(400).send('User not found! Payment FAILED.');

  lineItems.forEach((item) => {
    user.order.items.push(item);
  });

  try {
    const paymentResponse = await createAnAcceptPaymentTransaction(
      user,
      dataDescriptor,
      dataValue
    );
    res.send(paymentResponse);
  } catch (err) {
    res.status(400).send(err);
  }

  user.order.items.splice(0, user.order.items.length); // clear out orders array after payment transaction
});

module.exports = router;
