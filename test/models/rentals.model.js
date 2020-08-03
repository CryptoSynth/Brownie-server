const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

//CUSTOMERS MODEL
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  isGold: {
    type: Boolean,
    default: false
  }
});

//MOVIES MODEL
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  }
});

//RENTALS MODEL
const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  movie: {
    type: movieSchema,
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now()
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required()
  });

  return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
