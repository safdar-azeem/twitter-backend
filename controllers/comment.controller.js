const controller = {}
const STATUS = require('../utils/status')
const User = require('../models/user.model')
const Tweet = require('../models/tweet.model')
const Comment = require('../models/comment.model')
const Notification = require('../models/notification.model')

controller.getCommentsByTweetId = async (req, res) => {
   try {
      const comments = await Comment.find({ tweet: req.params.id }).populate('user').sort({ createdAt: -1 })
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Comments found',
         comments,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.postComment = async (req, res) => {
   try {
      const { content, tweetId, userId } = req.body
      const [tweet, user] = await Promise.all([
         Tweet.findById(tweetId).populate('user'),
         User.findById(userId),
      ])
      if (!tweet || !user) {
         return res.status(STATUS.BAD_REQUEST).json({
            status: STATUS.BAD_REQUEST,
            message: 'Tweet or user not found',
         })
      }
      const comment = new Comment({
         content,
         user,
         tweet,
      })
      await comment.save()
      tweet.comments.push(comment._id)
      await tweet.save()
      if (user._id.toString() !== tweet.user._id.toString()) {
         const notification = new Notification({
            sender: user._id,
            receiver: tweet.user._id,
            tweet: tweet._id,
            type: 'comment',
         })
         await notification.save()
      }
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Comment posted successfully',
         comment,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

module.exports = controller
