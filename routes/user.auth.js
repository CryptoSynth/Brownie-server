const express = require('express');
const {
  User,
  validateUser,
  generateAuthToken
} = require('../models/users.model');
const bcrypt = require('bcrypt');

const router = express.Router();
/*===========================================================================
auth ROUTES
=============================================================================*/

//POST '/'
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({
    'account.email': req.body.account.email
  });

  if (!user) return res.status(400).send('Invalid email or password!');

  const validPassword = await bcrypt.compare(
    req.body.account.password,
    user.account.password
  );

  if (!validPassword) return res.status(400).send('Invalid email or password!');

  //filter user to send non-sensitive data
  const user_filtered = filterUser(user);

  const token = generateAuthToken(user);
  res.header('x-auth-token', `JWT ${token}`).send(user_filtered);
});

function filterUser(user) {
  //filter out non account information
  const current_user = {
    account: {
      firstName: user.account.firstName,
      lastName: user.account.lastName,
      email: user.account.email
    },
    isSubscribed: user.isSubscribed
  };

  return current_user;
}

module.exports = router;
