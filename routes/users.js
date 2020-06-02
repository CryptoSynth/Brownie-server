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
router.get('/', (req, res) => {
  res.send(db.users);
});

//GET '/:id'
router.get('/:id', (req, res) => {
  const user = db.users.find((user) => user.id === req.params.id);
  if (!user) return res.status(400).send('User not found!');

  res.send(user);
});

//POST '/'
router.post('/', async (req, res) => {
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
      address: '',
      city: '',
      state: '',
      zipCode: '',
      email: req.body.account.email,
      password: secret
    },
    orders: [],
    isAdmin: false
  };

  db.users.push(user);

  const { id, isAdmin } = user;

  const token = generateAuthToken(user.id);

  res.header('x-auth-token', `JWT ${token}`).send({
    id,
    isAdmin
  });
});

function validateUser(body) {
  const schema = Joi.object({
    account: {
      firstName: Joi.string().allow('').max(255),
      lastName: Joi.string().allow('').max(255),
      address: Joi.string().allow('').max(255),
      city: Joi.string().allow('').max(255),
      state: Joi.string().allow('').max(255),
      zipCode: Joi.string().allow('').max(255),
      email: Joi.string().email().required().min(3).max(255),
      password: Joi.string().required().min(3).max(255)
    },
    orders: Joi.array(),
    isAdmin: Joi.boolean()
  });

  return schema.validate(body);
}

module.exports = router;
