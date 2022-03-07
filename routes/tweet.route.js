const express = require('express');
const router = express.Router();
const controller = require('../controllers/tweet.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/getTweets/:id', controller.getTweets);
router.get('/getUserTweets/:id', controller.getUserTweets);
router.get('/getUserMediaTweets/:id', controller.getUserMediaTweets);
router.get('/getTweetsLikeByUser/:id', controller.getTweetsLikeByUser);
router.get('/getTweetById/:id', controller.getTweetById);
router.post('/likeTweet/:id/:userId', authMiddleware, controller.likeTweet);
router.post('/retweet/:id/:userId', authMiddleware, controller.retweet);
router.post('/uploadPhoto', authMiddleware, controller.uploadTweetPhoto);
router.post('/upload', authMiddleware, controller.postTweet);

module.exports = router;
