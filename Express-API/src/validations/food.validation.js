const Joi = require('joi');
const { createSchema } = require('.');

const createFood = {
  body: createSchema([
    { name: 'foodName', type: Joi.string().required() },
    { name: 'gIndex', type: Joi.number().required() },
    { name: 'gLoad', type: Joi.number().required() },
    { name: 'giCategory', type: Joi.string().required() },
    { name: 'glCategory', type: Joi.string().required() },
    { name: 'carbs', type: Joi.number().required() },
    { name: 'calories', type: Joi.number().required() },
    { name: 'fats', type: Joi.number().required() },
    { name: 'proteins', type: Joi.number().required() },
    { name: 'category', type: Joi.string().required() },
  ]),
};

const foodName = {
  body: createSchema([
    { name: 'foodName', type: Joi.string().required() },
  ]),
};

module.exports = {
  createFood,
  foodName,
};
