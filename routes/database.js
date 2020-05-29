const express = require('express');
const Joi = require('@hapi/joi');
const db = require('../db');

const uuid = require('uuid');

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
  const product = db.products.find((product) => product.id === req.params.id);
  if (!product) return res.status(404).send('product not found!');

  res.send(product);
});

//POST '/'
router.post('/', (req, res) => {
  const { error } = validateSchema(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = {
    id: uuid.v4(),
    image: req.body.image,
    name: req.body.name,
    description: req.body.description,
    price: parseInt(req.body.price)
  };

  db.products.push(product);
  res.send(product);
});

//PUT '/:id'
router.put('/:id', (req, res) => {
  const product = db.products.find((product) => product.id === req.params.id);
  if (!product) return res.status(404).send('product not found!');

  product.image = req.body.image ? req.body.image : product.image;
  product.name = req.body.name ? req.body.name : product.name;
  product.description = req.body.description
    ? req.body.description
    : product.description;
  product.price = parseInt(req.body.price ? req.body.price : product.price);

  res.send(product);
});

//DELETE '/:id
router.delete('/:id', (req, res) => {
  const product = db.products.find((product) => product.id === req.params.id);
  if (!product) return res.status(400).send('product not found!');

  const index = db.products.indexOf(product);
  db.products.splice(index, 1);

  res.send(product);
});

function validateSchema(body) {
  const schema = Joi.object({
    image: Joi.string().required(),
    name: Joi.string().required().min(3).max(255),
    description: Joi.string().required().min(3).max(255),
    price: Joi.number().required().min(3).max(255)
  });

  return schema.validate(body);
}

module.exports = router;
