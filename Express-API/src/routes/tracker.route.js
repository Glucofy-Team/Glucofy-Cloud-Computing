const express = require('express');

const router = express.Router();
const validate = require('../middlewares/validate');
const { authMiddleware } = require('../middlewares/user.middleware');
const trackerController = require('../controllers/tracker.controller');
const trackerValidation = require('../validations/tracker.validation');

router.get('/', authMiddleware, trackerController.getTrackers);
router.post('/add', authMiddleware, validate(trackerValidation.createTracker), trackerController.createTracker);
router.delete('/delete/:trackerId', authMiddleware, trackerController.deleteTracker);

module.exports = router;
