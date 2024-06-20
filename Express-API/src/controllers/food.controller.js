const httpStatus = require('http-status');
const { Firestore } = require('@google-cloud/firestore');

const {
  readDataFood,
  createDataFood,
  deleteDataFood,
  readSingleDataFood,
  readDataFoodToday,
} = require('../models/food.models');

const createFood = async (req, res) => {
  const data = req.body;
  const { id } = req;

  try {
    const date = new Date();
    const timestamp = Firestore.Timestamp.fromDate(date);

    const newData = {
      ...data,
      datetime: timestamp,
    };

    const foodId = await createDataFood('users', id, 'food', newData);

    return res.status(httpStatus.CREATED).send({
      status: httpStatus.CREATED,
      message: 'Create Food Success',
      foodId,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while creating food',
    });
  }
};

const getFood = async (req, res) => {
  const { id } = req;
  const { foodId } = req.params;

  try {
    const doc = await readSingleDataFood('users', id, 'food', foodId);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Get Food Success',
      data: doc,
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

const getFoods = async (req, res) => {
  const { id } = req;
  const { name } = req.query;

  try {
    const data = await readDataFood('users', id, 'food', name);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Get Foods Success',
      data,
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

const getFoodsToday = async (req, res) => {
  const { id } = req;
  const { name } = req.query;

  try {
    const data = await readDataFoodToday('users', id, 'food', name);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Get Foods Success',
      totalCalories: data.totalCalories,
      data: data.data,
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

const deleteFood = async (req, res) => {
  const { id } = req;
  const { foodId } = req.params;

  try {
    await deleteDataFood('users', id, 'food', foodId);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Delete Food Success',
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

module.exports = {
  createFood,
  getFood,
  getFoods,
  getFoodsToday,
  deleteFood,
};
