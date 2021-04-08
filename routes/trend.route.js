const express = require('express')
const router = express.Router()
const controller = require('../controllers/trend.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/add', controller.addTrend)
router.get('/getTop', controller.getTopTrends)
router.get('/find/:name/:userId', controller.findTrend)
router.delete('/delete/:name/:tweet', controller.deleteTend)

module.exports = router
