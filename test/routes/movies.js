const express = require('express');
const { Movie, validateMovie } = require('../models/movie.model');
const { Genre } = require('../models/genre.model');

const router = express.Router();

//CUSTOMERS route
router.get('/', async (req, res) => {
  const movies = await Movie.find();

  res.send(movies);
});

router.post('/', async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  let movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    genre: {
      id: genre._id,
      name: genre.name
    },
    dailyRentalRate: req.body.dailyRentalRate
  });

  movie = await movie.save();

  res.send(movie);
});

module.exports = router;
