const Movie = require('../models/movie');

const {
  STATUS_OK,
} = require('../utils/constants');

const Error404 = require('../errors/Error404');
const Error403 = require('../errors/Error403');

// получает все сохраненные фильмы
module.exports.findAllMovies = (req, res, next) => {
  const { owner } = req.user._id;
  Movie.find({ owner })
    .populate('owner')
    .then((movie) => res.send(movie))
    .catch(next);
};

// создает фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new Error404('Фильм не создан');
      }
      movie
        .populate('owner')
        .then(() => res.status(STATUS_OK).send(movie))
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};

// удалить фильм
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new Error404('Такой фильм не существует.');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Error403('Удалять фильмы может только владелец');
      }

      return Movie.deleteOne(movie)
        .then(() => res.send({ message: 'Фильм успещно удален' }))
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};
