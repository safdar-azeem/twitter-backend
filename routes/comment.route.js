const express = require('express')
const router = express.Router()
const controller = require('../controllers/comment.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/getCommentsByTweetId/:id', controller.getCommentsByTweetId)
router.post('/add', authMiddleware, controller.postComment)

module.exports = router
