const express = require('express');
const Joi = require('@hapi/joi');
const { db, generateAuthToken } = require('../db');
const bcrypt = require('bcrypt');

const router = express.Router();
/*===========================================================================
auth ROUTES
=============================================================================*/

//POST '/'
router.post('/', async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = db.users.find((user) => {
    return user.account.email === req.body.account.email;
  });

  if (!user) return res.status(400).send('Invalid email or password!');

  const validPassword = await bcrypt.compare(
    req.body.account.password,
    user.account.password
  );

  if (!validPassword) return res.status(400).send('Invalid email or password!');
  const token = generateAuthToken(user.id);

  const { id, isAdmin } = user;

  res.header('x-auth-token', `JWT ${token}`).send({
    id,
    isAdmin
  });
});

function validateAuth(body) {
  const schema = Joi.object({
    account: {
      email: Joi.string().email().required().min(3).max(255),
      password: Joi.string().required().min(3).max(255)
    }
  });

  return schema.validate(body);
}

module.exports = router;
