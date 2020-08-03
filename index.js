//INIT LIBS
const result = require('dotenv').config();
const config = require('config');
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const debug = require('debug')('app:database');

//INIT ROUTES
const users = require('./routes/users');
const auth = require('./routes/user.auth');
const admin = require('./routes/admin.auth');
const products = require('./routes/products');
const checkouts = require('./routes/checkouts');
const orders = require('./routes/orders');
const shipping = require('./routes/shipping');
const tracking = require('./routes/tracking');
const home = require('./routes/home');

//delete this test file
const genres = require('./test/routes/genres');
const customers = require('./test/routes/customers');
const movies = require('./test/routes/movies');
const rentals = require('./test/routes/rentals');

//INIT EXPRESS
const app = express();

//CONNECT MONGODB
const url = config.get('db_url');
mongoConnection(url);

//VALIDATE secretkey
const getSecretKey = config.get('secretKey');

if (result.error) {
  throw result.error;
}

debug(result.parsed);

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
app.set('views', './views');
app.set('view engine', 'pug');

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
app.use('/api/users', users);
app.use('/api/user-auth', auth);
app.use('/api/admin-auth', admin);
app.use('/api/products', products);
app.use('/api/checkouts', checkouts);
app.use('/api/orders', orders);
app.use('/api/shipping', shipping);
app.use('/api/tracking', tracking);
app.use('/', home);

//delete this test file
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

//CREATE MIDDLEWARE ERROR HANDLER

//CREATE PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

//================================================//
//FUNCTION LIST
//================================================//

//MONGODB Connection
async function mongoConnection(url) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('Connected to MongoDB...');
  } catch (err) {
    console.log('Could not connect to MongoDB...', err);
  }
}
