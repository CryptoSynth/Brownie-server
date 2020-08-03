const Easypost = require('@easypost/api');
const express = require('express');
const config = require('config');
const api = new Easypost(config.get('shippingKey'));

const router = express.Router();

//GET '/shipments/
router.get('/shipments/all', async (req, res) => {
  try {
    const shipping_lists = await api.Shipment.all();
    res.send(shipping_lists);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
