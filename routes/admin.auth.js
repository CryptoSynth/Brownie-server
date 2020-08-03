const express = require('express');
const auth = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', auth, (req, res) => {
  if (!req.user.isAdmin)
    return res.status(401).send({
      isNotAdmin: true
    });

  res.send({ isAdmin: true });
});

module.exports = router;
