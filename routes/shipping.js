const Easypost = require('@easypost/api');
const express = require('express');
const config = require('config');
const api = new Easypost(config.get('shippingKey'));
const auth = require('../middleware/auth.middleware');

const router = express.Router();

//GET '/shipments/
router.get('/shipments/all', auth, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const shipping_lists = await api.Shipment.all();
      res.send(shipping_lists);
    } catch (err) {
      res.send(err);
    }
  }

  res.status(401).status('Unauthroized Request.');
});

module.exports = router;
