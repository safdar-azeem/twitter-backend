const express = require('express');
const router = express.Router();
const controller = require('../controllers/tweet.controller');

router.post('/postTweet', controller.postTweet);

module.exports = router;
