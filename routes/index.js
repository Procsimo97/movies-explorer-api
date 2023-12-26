const router = require('express').Router();
const userRouters = require('./users');
const movieRouters = require('./movies');
const Error404 = require('../errors/Error404');

router.use(userRouters);
router.use(movieRouters);
router.use((req, res, next) => {
  next(new Error404('Страница не найдена.'));
});

module.exports = router;
