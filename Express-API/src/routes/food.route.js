const express = require('express');

const router = express.Router();
const validate = require('../middlewares/validate');
const { authMiddleware } = require('../middlewares/user.middleware');
const foodController = require('../controllers/food.controller');
const foodValidation = require('../validations/food.validation');

router.get('/', authMiddleware, foodController.getFoods);
router.get('/today', authMiddleware, foodController.getFoodsToday);
router.post('/add', authMiddleware, validate(foodValidation.createFood), foodController.createFood);
router.get('/detail/:foodId', authMiddleware, foodController.getFood);
router.delete('/delete/:foodId', authMiddleware, foodController.deleteFood);

module.exports = router;
