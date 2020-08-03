const express = require('express');
const { Customer, validateCustomer } = require('../models/customer.model');

const router = express.Router();

//CUSTOMERS route
router.get('/', async (req, res) => {
  const customers = await Customer.find();

  res.send(customers);
});

router.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone
  });

  customer = await customer.save();

  res.send(customer);
});

module.exports = router;
