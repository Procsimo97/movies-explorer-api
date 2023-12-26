const router = require('express').Router();
const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  createUser,
  getAboutMe,
  updateUserProfile,
  login,
} = require('../controllers/users');

const { getUserInfoJoiSchema, loginJoiSchema } = require('../utils/validation');

// регистрация и авторизация
router.post('/signup', celebrate(loginJoiSchema), createUser);
router.post('/signin', login);

// получение информации о текущем пользователе
router.get('/users/me', auth, getAboutMe);

// обновление данных пользователя
router.patch('/users/me', auth, celebrate(getUserInfoJoiSchema), updateUserProfile);

module.exports = router;
