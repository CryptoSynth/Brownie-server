const express = require('express');
const { Order, OrderState } = require('../models/orders.model');
const { User } = require('../models/users.model');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

/*===========================================================================
orders ROUTES
=============================================================================*/

//GET 'all users orders'
router.get('/', auth, async (req, res) => {
  if (req.user.isAdmin) {
    const orders = await Order.find().select({ __v: 0 });
    res.send(orders);
  }

  res.status(401).status('Unauthorized Request.');
});

router.post('/fullfilled/:id', async (req, res) => {
  let order = await Order.findById({ _id: req.params.id }).select({ __v: 0 });
  if (!order) return res.status(400).send('Order not found.');

  await order.updateOne({ isFullfilled: true });
  const user = await User.findOneAndUpdate(
    {
      orders: { $elemMatch: { _id: req.params.id } }
    },
    {
      'orders.$.isFullfilled': true
    },
    { new: true }
  );

  const user_order = user.orders.find((order) => order._id == req.params.id);

  res.send({
    order_status: user_order.isFullfilled
  });
});

module.exports = router;
