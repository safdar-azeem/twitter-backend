const express = require('express')
const router = express.Router()
const controller = require('../controllers/tweet.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/getTweetById/:id', controller.getTweetById)
router.post('/upload', authMiddleware, controller.postTweet)
router.get('/getTweets', authMiddleware, controller.getTweets)
router.post('/retweet/:id', authMiddleware, controller.retweet)
router.post('/likeTweet/:id', authMiddleware, controller.likeTweet)
router.delete('/delete/:id', authMiddleware, controller.deleteTweet)
router.get('/exploreTweets/', authMiddleware, controller.exploreTweets)
router.get('/getUserTweets/:id', authMiddleware, controller.getUserTweets)
router.get('/getUserMediaTweets/:id', authMiddleware, controller.getUserMediaTweets)
router.get('/getTweetsLikeByUser/:id', authMiddleware, controller.getTweetsLikeByUser)

module.exports = router
