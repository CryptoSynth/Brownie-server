const express = require('express');
const Joi = require('@hapi/joi');
const { db, generateAuthToken } = require('../db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

const router = express.Router();
/*===========================================================================
users ROUTES
=============================================================================*/
//GET '/'
router.get('/', async (req, res) => {
  res.send(db.users);
});

//GET '/:id'
router.get('/:id', async (req, res) => {
  const user = db.users.find((user) => user.id === req.params.id);
  if (!user) return res.status(400).send('User not found!');

  res.send(user);
});

//POST '/'
router.post('/', async (req, res) => {
  if (!req.body.account.password) {
    req.body.account = {
      ...req.body.account,
      password: uuid.v4().substring(0, 8)
    };
    console.log(req.body.account);
  }

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isRegistered = db.users.find((user) => {
    return user.account.email === req.body.account.email;
  });

  if (isRegistered) return res.status(400).send('email already registered!');

  const salt = await bcrypt.genSalt(10);
  const secret = await bcrypt.hash(req.body.account.password, salt);

  const user = {
    id: uuid.v4(),
    account: {
      firstName: req.body.account.firstName,
      lastName: req.body.account.lastName,
      email: req.body.account.email,
      password: secret,
      shipping: req.body.account.shipping || {},
      billing: req.body.account.billing || {}
    },
    items: [],
    orders: [],
    isAdmin: false,
    isSubscribed: req.body.isSubscribed || false
  };

  db.users.push(user);

  const { id, isAdmin, account } = user;

  const token = generateAuthToken(user.id);

  res.header('x-auth-token', `JWT ${token}`).send({
    id,
    isAdmin,
    email: account.email
  });
});

function validateUser(body) {
  const schema = Joi.object({
    account: {
      firstName: Joi.string().allow('').max(255),
      lastName: Joi.string().allow('').max(255),
      email: Joi.string().email().required().min(3).max(255),
      password: Joi.string().required().min(3).max(255),
      shipping: Joi.object(),
      billing: Joi.object()
    },
    isAdmin: Joi.boolean(),
    isSubscribed: Joi.boolean()
  });

  return schema.validate(body);
}

module.exports = router;
