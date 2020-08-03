const mongoose = require('mongoose');
const { orderSchema } = require('./orders.model');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

//Construct User Model & Schema
const User = mongoose.model(
  'User',
  new mongoose.Schema({
    account: {
      firstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      lastName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
      },
      password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
      },
      shipping: {
        type: Object,
        default: {
          firstName: '',
          lastName: '',
          addressOne: '',
          addressTwo: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      },
      billing: {
        type: Object,
        default: {
          firstName: '',
          lastName: '',
          addressOne: '',
          addressTwo: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phoneNum: ''
        }
      }
    },
    orders: [orderSchema],
    isSubscribed: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  })
);

function validateUser(body) {
  const schema = Joi.object({
    account: {
      firstName: Joi.string().allow('').max(255),
      lastName: Joi.string().allow('').max(255),
      email: Joi.string().email().required().min(3).max(255),
      password: Joi.string().required().min(3).max(255),
      billing: Joi.object(),
      shipping: Joi.object()
    },
    isSubscribed: Joi.boolean()
  });

  return schema.validate(body);
}

function generateAuthToken(user) {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin
    },
    config.get('secretKey')
  );
}

module.exports.User = User;
module.exports.generateAuthToken = generateAuthToken;
module.exports.validateUser = validateUser;
