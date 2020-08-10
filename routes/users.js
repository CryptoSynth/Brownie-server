const express = require('express');
const config = require('config');
const {
  User,
  validateUser,
  generateAuthToken
} = require('../models/users.model');
const auth = require('../middleware/auth.middleware');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');

const router = express.Router();

sgMail.setApiKey(config.get('sendgridKey'));

/*===========================================================================
users ROUTES
=============================================================================*/

//GET '/'
router.get('/', auth, async (req, res) => {
  if (req.user.isAdmin) {
    const users = await User.find({ isAdmin: false }).select({
      __v: 0,
      isAdmin: 0
    });
    return res.send(users);
  }

  res.status(401).status('Unauthorized Request.');
});

//GET '/current_user'
router.get('/me', auth, async (req, res) => {
  const user = await User.findById({ _id: req.user.id }).select({
    __v: 0,
    isAdmin: 0,
    _id: 0,
    'account.password': 0
  });
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

    console.log(req.body.account.password);
  }

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isRegistered = await User.findOne({ email: req.body.account.email });
  if (isRegistered) return res.status(400).send('email already registered!');

  const salt = await bcrypt.genSalt(10);
  const secret = await bcrypt.hash(req.body.account.password, salt);

  let user = new User({
    account: {
      firstName: req.body.account.firstName,
      lastName: req.body.account.lastName,
      email: req.body.account.email,
      password: secret,
      shipping: req.body.account.shipping,
      billing: req.body.account.billing
    },
    isSubscribed: req.body.isSubscribed
  });

  await user.save();

  //filter user to send non-sensitive data
  const user_filtered = filterUser(user);

  const token = generateAuthToken(user);
  res.header('x-auth-token', `JWT ${token}`).send(user_filtered);
});

//Update '/current_user'
router.put('/me', auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    'account.firstName': req.body.account.firstName,
    'account.lastName': req.body.account.lastName,
    'account.email': req.body.account.email,
    'account.shipping': req.body.account.shipping,
    'account.billing': req.body.account.billing,
    isSubscribed: req.body.isSubscribed
  }).select({ isAdmin: 0, __v: 0, _id: 0 });

  //filter user to send non-sensitive data
  const user_filtered = filterUser(user);

  if (!user) return res.status(400).send('User not found!');

  res.send(user_filtered);
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
