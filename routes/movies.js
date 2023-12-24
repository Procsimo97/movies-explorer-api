const router = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const { createMovie, findAllMovies, deleteMovie } = require('../controllers/movies');
const { idMovieJoiSchema, getMovieJoiSchema } = require('../utils/validation');

// создание фильма
router.post('/movies', auth, celebrate(getMovieJoiSchema), createMovie);
// удаление фильма
router.delete('/movies/:id', auth, celebrate(idMovieJoiSchema), deleteMovie);

// все сохраненные фильмы
router.get('/movies', auth, findAllMovies);

module.exports = router;
