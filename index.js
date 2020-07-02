//INIT LIBS
const express = require('express');
const cors = require('cors');
const config = require('config');
const debug = require('debug')('app:database');

//INIT ROUTES
const auth = require('./routes/auth');
const users = require('./routes/users');
const products = require('./routes/products');
const checkouts = require('./routes/checkouts');
const orders = require('./routes/orders');
const home = require('./routes/home');

//INIT EXPRESS
const app = express();

//VALIDATE secretkey
const getSecretKey = config.get('secretKey');

if (!getSecretKey) {
  debug('FATAL ERROR: secretKey is not defined!');
  process.exit(1);
}

//INIT DB
process.env.NODE_ENV === 'development'
  ? debug('Connected to DEV database')
  : debug('Connected to PROD database');

//SET CONFIGURATION
if (app.get('env') === 'development') {
  debug('We are currently in development!');
}

//INIT TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', './views');

//INIT MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  cors({
    exposedHeaders: 'x-auth-token' // only development?
  })
);

//SET ROUTES
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/checkouts', checkouts);
app.use('/api/orders', orders);
app.use('/', home);

//CREATE MIDDLEWARE ERROR HANDLER

//CREATE PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
