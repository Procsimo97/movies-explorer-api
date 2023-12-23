const router = require('express').Router();
const userRouters = require('./users');

router.use(userRouters);

module.exports = router;
