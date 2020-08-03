const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

//GENRE MODEL
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(255)
  });

  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validateGenre = validateGenre;
