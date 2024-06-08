const Joi = require('joi');
const { password } = require('./custom.validation');
const { createSchema } = require('.');

const userLogin = {
  body: createSchema([
    { name: 'email', type: Joi.string().email({ tlds: true }).required() },
    { name: 'password', type: Joi.string().custom(password).required() },
  ]),
};

const createUser = {
  body: createSchema([
    { name: 'email', type: Joi.string().email({ tlds: true }).required() },
    { name: 'password', type: Joi.string().custom(password).required() },
    { name: 'firstName', type: Joi.string().required() },
    { name: 'lastName', type: Joi.string().required() },
    { name: 'phoneNumber', type: Joi.string().required() },
    { name: 'gender', type: Joi.string().required() },
    { name: 'weight', type: Joi.number().positive().required() },
    { name: 'height', type: Joi.number().positive().required() },
    { name: 'age', type: Joi.number().positive().required() },
  ]),
};

const updateUser = {
  body: createSchema([
    { name: 'email', type: Joi.string().email({ tlds: true }) },
    { name: 'password', type: Joi.string().custom(password) },
    { name: 'firstName', type: Joi.string() },
    { name: 'lastName', type: Joi.string() },
    { name: 'phoneNumber', type: Joi.string() },
    { name: 'gender', type: Joi.string() },
    { name: 'weight', type: Joi.number().positive() },
    { name: 'height', type: Joi.number().positive() },
    { name: 'age', type: Joi.number().positive() },
  ]),
};

module.exports = {
  createUser,
  updateUser,
  userLogin,
};
