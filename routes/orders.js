const express = require('express');
const { Order } = require('../models/orders.model');

const router = express.Router();

/*===========================================================================
orders ROUTES
=============================================================================*/

//GET 'all users orders'
router.get('/', async (req, res) => {
  const orders = await Order.find().select({ __v: 0 });

  res.send(orders);
});

module.exports = router;
