const express = require('express');
const router = express.Router();
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const tweetRoute = require('./tweet.route');

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/tweets', tweetRoute);

module.exports = router;