const Easypost = require('@easypost/api');
const express = require('express');
const config = require('config');
const api = new Easypost(config.get('shippingKey'));

const router = express.Router();

//GET '/trackers/
router.get('/trackers/all', async (req, res) => {
  try {
    const tracking_lists = await api.Tracker.all();
    res.send(tracking_lists);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
