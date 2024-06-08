const Joi = require('joi');
const { createSchema } = require('.');

const createTracker = {
  body: createSchema([
    { name: 'glucose', type: Joi.number().positive().required() },
    { name: 'condition', type: Joi.string().required() },
    { name: 'notes', type: Joi.string().required() },
    { name: 'datetime', type: Joi.string().required() },
  ]),
};

module.exports = {
  createTracker,
};
