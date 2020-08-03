const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

//Construct Product Model & Schema
const Product = mongoose.model(
  'Product',
  mongoose.Schema({
    image: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
    },
    price: {
      type: Number,
      required: true
    }
  })
);

function validateProduct(body) {
  const schema = Joi.object({
    image: Joi.string().required(),
    name: Joi.string().required().min(3).max(255),
    description: Joi.string().required().min(3).max(255),
    price: Joi.number().required().min(0)
  });

  return schema.validate(body);
}

module.exports.validateProduct = validateProduct;
module.exports.Product = Product;
