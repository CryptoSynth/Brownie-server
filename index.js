//INIT LIBS
const express = require('express');
const cors = require('cors');
// const config = require('config');
const debug = require('debug')('app:database');

//INIT ROUTES
const database = require('./routes/database');
const home = require('./routes/home');

//INIT EXPRESS
const app = express();

//INIT TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', './views');

//INIT MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

//SET CONFIGURATION
if (app.get('env') === 'development') {
  debug('We are currently in development!');
}

//SET ROUTES
app.use('/api/products', database);
app.use('/', home);

//INIT DB
debug('Connected to database');

//CREATE ROUTES

//CREATE MIDDLEWARE ERROR HANDLER

//CREATE PORT
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
