const express = require('express');
const { Rental, validateRental } = require('../models/rentals.model');
const { Movie } = require('../models/movie.model');
const { Customer } = require('../models/customer.model');

const router = express.Router();

//RENTALS route
router.get('/', async (req, res) => {
  const rentals = await Rental.find();

  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  let rental = new Rental({
    customer: {
      id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      id: movie._id,
      title: movie.title,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  rental = await rental.save();

  res.send(rental);
});

module.exports = router;
