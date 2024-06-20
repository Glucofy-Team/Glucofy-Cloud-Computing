const express = require('express');

const router = express.Router();
const { authMiddleware } = require('../middlewares/user.middleware');
const datasetController = require('../controllers/dataset.controller');

router.get('/', authMiddleware, datasetController.getDataset);
router.get('/detail/:dataId', authMiddleware, datasetController.getDetailDataset);

module.exports = router;
