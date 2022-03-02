const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const tweetRoute = require('./tweet.route');
const commentRoute = require('./comment.route');

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/tweet', tweetRoute);
router.use('/comment', commentRoute);

module.exports = router;