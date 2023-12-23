/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

const {
  STATUS_OK,
} = require('../utils/constants');

const Error404 = require('../errors/Error404');
const Error400 = require('../errors/Error400');
const Error401 = require('../errors/Error401');
const Error409 = require('../errors/Error409');

const options = {
  new: true, // обработчик then получит на вход обновлённую запись
  runValidators: true, // данные будут валидированы перед изменением
  upsert: true,
};

// функция создания пользователья
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 6)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(STATUS_OK).send({
        _id,
        name,
        email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new Error409('Пользователь с таким электронным адресом уже зарегистрирован'));
      }
      next(err);
    });
};

// возвращает ин6формацию о текущем пользователе
module.exports.getAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new Error404('Пользователь не авторизирован.');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error401(`${err} Юзер не найден`));
      }
      next(err);
    });
};

// функция обновления профиля
module.exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, options)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400('Переданы некорректные данные для обновления профиля пользователя.'));
      }
      next(err);
    });
};

// функция авторизации
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неверная почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      // возвращаем ошибку аутентификации
      next(new Error401(err.message));
    });
};
