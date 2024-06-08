const express = require('express');

const router = express.Router();
const validate = require('../middlewares/validate');
const { authMiddleware } = require('../middlewares/user.middleware');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');

router.get('/profile', authMiddleware, userController.getUser);
router.put('/update', authMiddleware, validate(userValidation.updateUser), userController.updateUser);
router.delete('/delete', authMiddleware, userController.deleteUser);

module.exports = router;
