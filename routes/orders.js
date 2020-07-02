const express = require('express');
const { db } = require('../db');

const router = express.Router();

/*===========================================================================
orders ROUTES
=============================================================================*/

//GET
router.get('/', (req, res) => {
  res.send(db.orders);
});

//GET ':id'
router.get('/:id', (req, res) => {
  const order = db.orders.find((order) => {
    return order.invoiceId === req.params.id;
  });

  if (!order) return res.status(404).send('The order Invoice Id is incorrect!');

  res.send(order);
});

module.exports = router;
