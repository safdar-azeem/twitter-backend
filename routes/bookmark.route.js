const express = require('express')
const router = express.Router()
const controller = require('../controllers/bookMark.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/add/:userId/:tweetId', authMiddleware, controller.addBookmark)
router.get('/get/:userId', authMiddleware, controller.getBookmarks)

module.exports = router
