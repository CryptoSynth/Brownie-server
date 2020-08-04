const express = require('express');
const { Order } = require('../models/orders.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/*===========================================================================
orders ROUTES
=============================================================================*/

//GET 'all users orders'
router.get('/', auth, async (req, res) => {
  if (req.user.isAdmin) {
    const orders = await Order.find().select({ __v: 0 });
    res.send(orders);
  }

  res.status(401).status('Unauthroized Request.');
});

module.exports = router;
