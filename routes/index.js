const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const tweetRoute = require('./tweet.route');
const commentRoute = require('./comment.route');
const bookmarkRoute = require('./bookmark.route');
const trendRoute = require('./trend.route');
const notificationRoute = require('./notification.route');

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/tweet', tweetRoute);
router.use('/comment', commentRoute);
router.use('/bookmar', bookmarkRoute);
router.use('/trend', trendRoute);
router.use('/notification', notificationRoute);

module.exports = router;