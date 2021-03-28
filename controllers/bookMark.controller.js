const controller = {}
const STATUS = require('../utils/status')
const User = require('../models/user.model')
const Tweet = require('../models/tweet.model')

controller.addBookmark = async (req, res) => {
   try {
      const { userId, tweetId } = req.params
      const [user, tweet] = await Promise.all([
         User.findById(userId),
         Tweet.findById(tweetId).populate('user'),
      ])
      if (!user || !tweet) {
         return res.status(STATUS.BAD_REQUEST).json({
            status: STATUS.BAD_REQUEST,
            message: 'User or tweet not found',
         })
      }

      if (user.bookmarks.includes(tweet._id)) {
         user.bookmarks = user.bookmarks.filter((id) => id.toString() !== tweet._id.toString())
         tweet.bookmarks = tweet.bookmarks.filter((id) => id.toString() !== user._id.toString())
         await Promise.all([
            user.save({
               validateBeforeSave: false,
            }),
            tweet.save(),
         ])
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Bookmark removed successfully',
            tweet,
         })
      }

      user.bookmarks.unshift(tweet._id)
      tweet.bookmarks.unshift(user._id)
      await Promise.all([
         user.save({
            validateBeforeSave: false,
         }),
         tweet.save(),
      ])
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Bookmark added successfully',
         tweet,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getBookmarks = async (req, res) => {
   try {
      const { userId } = req.params
      const user = await User.findById(userId)
         .populate('bookmarks')
         .populate([
            {
               path: 'bookmarks',
               populate: {
                  path: 'user',
               },
            },
         ])
         .sort({ createdAt: -1 })
      if (!user) {
         return res.status(STATUS.BAD_REQUEST).json({
            status: STATUS.BAD_REQUEST,
            message: 'User not found',
         })
      }

      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Bookmarks retrieved successfully',
         bookmarks: user.bookmarks,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

module.exports = controller
