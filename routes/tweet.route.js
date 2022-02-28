const express = require('express');
const router = express.Router();
const controller = require('../controllers/tweet.controller');

router.post('/uploadPhoto', controller.uploadTweetPhoto);
router.post('/upload', controller.postTweet);

module.exports = router;
