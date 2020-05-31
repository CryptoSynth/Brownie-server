const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const isValidToken = jwt.verify(token, config.get('secretKey'));
    req.user = isValidToken;
    next();
  } catch (err) {
    res.status(400).send('Invalid token.');
  }
};
