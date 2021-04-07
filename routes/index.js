const express = require('express')
const userRoute = require('./user.route')
const authRoute = require('./auth.route')
const tweetRoute = require('./tweet.route')
const trendRoute = require('./trend.route')
const uploadRoute = require('./upload.route')
const commentRoute = require('./comment.route')
const bookmarkRoute = require('./bookmark.route')
const notificationRoute = require('./notification.route')

const router = express.Router()

router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/tweet', tweetRoute)
router.use('/trend', trendRoute)
router.use('/upload', uploadRoute)
router.use('/comment', commentRoute)
router.use('/bookmar', bookmarkRoute)
router.use('/notification', notificationRoute)

module.exports = router
