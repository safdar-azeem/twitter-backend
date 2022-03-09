const express = require('express');
const router = express.Router();
const controller = require('../controllers/trend.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/add', controller.addTrend);
router.get('/getTop', controller.getTopTrends);

module.exports = router;
