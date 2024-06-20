const httpStatus = require('http-status');
const { giveRecommend } = require('../models/vertex');

const FoodRecommendation = async (req, res) => {
  const { foodName } = req.body;

  try {
    const response = await giveRecommend(foodName);

    return res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: response,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while giving food recommendation',
    });
  }
};

module.exports = {
  FoodRecommendation,
};
