const Easypost = require('@easypost/api');
const express = require('express');
const config = require('config');
const api = new Easypost(config.get('shippingKey'));
const auth = require('../middleware/auth.middleware');

const router = express.Router();

//GET '/trackers/
router.get('/trackers/all', auth, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const tracking_lists = await api.Tracker.all();
      res.send(tracking_lists);
    } catch (err) {
      res.send(err);
    }
  }

  res.status(401).status('Unauthroized Request.');
});

module.exports = router;
