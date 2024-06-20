const express = require('express');

const router = express.Router();
const validate = require('../middlewares/validate');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');

router.post('/register', validate(userValidation.createUser), userController.createUser);
router.post('/login', validate(userValidation.userLogin), userController.findUser);

module.exports = router;
