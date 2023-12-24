const { Joi } = require('celebrate');

const URL_VALID = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const loginJoiSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
  }),
};

const getUserInfoJoiSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
};

const idMovieJoiSchema = {
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
};

const getMovieJoiSchema = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(URL_VALID),
    trailerLink: Joi.string().required().pattern(URL_VALID),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(URL_VALID),
    movieId: Joi.number().required(),
  }),
};

module.exports = {
  loginJoiSchema,
  getUserInfoJoiSchema,
  idMovieJoiSchema,
  getMovieJoiSchema,
};
