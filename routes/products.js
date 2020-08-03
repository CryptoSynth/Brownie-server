const express = require('express');
const { Product, validateProduct } = require('../models/product.model');
const router = express.Router();
/*===========================================================================
products ROUTES
=============================================================================*/

//GET '/'
router.get('/', async (req, res) => {
  const product = await Product.find().sort({ name: 1 }).select({ __v: 0 });

  res.send(product);
});

//GET '/:id'
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send('product not found!');

  res.send(product);
});

//POST '/'
router.post('/', async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let product = new Product({
    image: req.body.image,
    name: req.body.name,
    description: req.body.description,
    price: parseInt(req.body.price)
  });

  product = await product.save();
  res.send(product);
});

//PUT '/:id'
router.put('/:id', async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      image: req.body.image,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    },
    { new: true }
  );

  if (!product) return res.status(404).send('Product ID not found!');

  res.send(product);
});

//DELETE '/:id
router.delete('/:id', async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) return res.status(400).send('product not found!');

  res.send(product);
});

module.exports = router;
