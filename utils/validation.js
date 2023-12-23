const { Joi } = require('celebrate');

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

module.exports = {
  loginJoiSchema,
  getUserInfoJoiSchema,
};
