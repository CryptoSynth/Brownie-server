const express = require('express');

const router = express.Router();

/*===========================================================================
HOME ROUTES
=============================================================================*/

//GET '/'
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Brownie Server',
    message: 'Welcome to the brownie server API!'
  });
});

module.exports = router;
