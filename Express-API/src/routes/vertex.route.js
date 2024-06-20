const express = require('express');

const router = express.Router();
const validate = require('../middlewares/validate');
const { authMiddleware } = require('../middlewares/user.middleware');
const vertexController = require('../controllers/vertex.controller');
const foodValidation = require('../validations/food.validation');

router.post('/recommend', authMiddleware, validate(foodValidation.foodName), vertexController.FoodRecommendation);

module.exports = router;
