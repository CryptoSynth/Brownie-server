const express = require('express');
const Joi = require('@hapi/joi');
const db = require('../db.json');

const router = express.Router();

/*===========================================================================
DATABASE ROUTES
=============================================================================*/

//GET '/'
router.get('/', (req, res) => {
  res.send(db.products);
});

//GET '/:id'
router.get('/:id', (req, res) => {
  const product = db.products.find(
    (product) => product.id === parseInt(req.params.id)
  );
  if (!product) return res.status(404).send('product not found!');

  res.send(product);
});

//POST '/'
router.post('/', (req, res) => {
  const { error } = validateSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = {
    id: db.products.length + 1,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price
  };

  db.products.push(product);
  res.send(product);
});

//PUT '/:id'
router.put('/:id', (req, res) => {
  const product = db.products.find(
    (product) => product.id === parseInt(req.params.id)
  );
  if (!product) return res.status(404).send('product not found!');

  const { error } = validateSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  product.name = req.body.name;
  product.description = req.body.description;
  product.price = req.body.price;

  res.send(product);
});

//DELETE '/:id
router.delete('/:id', (req, res) => {
  const product = db.products.find(
    (product) => product.id === parseInt(req.params.id)
  );
  if (!product) return res.status(400).send('product not found!');

  const index = db.products.indexOf(product);
  db.products.splice(index, 1);

  res.send(product);
});

function validateSchema(body) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    description: Joi.string().required().min(3).max(255),
    price: Joi.number().required().min(3).max(255)
  });

  return schema.validate(body);
}

module.exports = router;
