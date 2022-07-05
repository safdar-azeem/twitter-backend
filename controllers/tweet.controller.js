const controller = {}
const cache = require('../config/cache')
const STATUS = require('../utils/status')
const User = require('../models/user.model')
const Tweet = require('../models/tweet.model')
const shuffleArray = require('../utils/shuffleArray')
const Comment = require('../models/comment.model')
const Notification = require('../models/notification.model')

const cacheTTL = 7200 // 2 hour

controller.postTweet = async (req, res) => {
   try {
      const tweet = new Tweet({
         ...req.body,
         user: req.user,
      })
      await tweet.save()
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweet posted successfully',
         tweet,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getTweets = async (req, res) => {
   try {
      const user = req.user
      const allIds = [...user.following, user._id]
      const tweets = await Tweet.find({
         $or: [
            {
               $and: [
                  {
                     $or: [
                        {
                           user: {
                              $in: allIds,
                           },
                        },
                        {
                           retweetedBy: {
                              $in: allIds,
                           },
                        },
                     ],
                  },
                  {
                     $or: [
                        {
                           is_Public: true,
                        },
                        {
                           user: user._id,
                        },
                     ],
                  },
               ],
            },
            {
               user: {
                  $in: user._id,
               },
               is_Public: true,
            },
         ],
      })
         .populate('user')
         .sort({ createdAt: -1 })
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweets fetched successfully',
         tweets,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getUserTweets = async (req, res) => {
   try {
      const userId = req.params.id
      const loggedInUserId = req.user._id.toString()

      const query = loggedInUserId === userId ? { user: userId } : { user: userId, is_Public: true }
      const tweets = await Tweet.find(query).populate('user').sort({ createdAt: -1 })

      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweets fetched successfully',
         tweets,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getUserMediaTweets = async (req, res) => {
   try {
      const userId = req.params.id
      const loggedInUserId = req.user ? req.user._id.toString() : null

      let query =
         loggedInUserId === userId
            ? { user: userId, photo: { $exists: true, $ne: null } }
            : { user: userId, is_Public: true, photo: { $exists: true, $ne: null } }

      const tweets = await Tweet.find(query).populate('user').sort({ createdAt: -1 })
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweets fetched successfully',
         tweets,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getTweetsLikeByUser = async (req, res) => {
   try {
      const tweets = await Tweet.find({
         likes: req.params.id,
         $or: [
            {
               user: req.params.id,
            },
            {
               is_Public: true,
            },
         ],
      })
         .populate('user')
         .sort({ createdAt: -1 })
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweets fetched successfully',
         tweets,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getTweetById = async (req, res) => {
   try {
      const tweet = await Tweet.findById(req.params.id).populate('user')

      if (!tweet) {
         return res.status(STATUS.NOT_FOUND).json({
            message: 'Tweet not found',
         })
      }

      tweet.comments = await Comment.find({
         _id: tweet.comments,
      }).populate('user')

      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweet fetched successfully',
         tweet,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.likeTweet = async (req, res) => {
   try {
      const user = req.user

      const tweet = await Tweet.findById(req.params.id)
      if (!tweet) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'Tweet not found',
         })
      }

      const notificationObj = {
         sender: user._id,
         receiver: tweet.user,
         type: 'like',
         tweet: tweet._id,
      }

      if (tweet.likes.includes(user._id)) {
         tweet.likes = tweet.likes.filter((like) => like.toString() !== user._id.toString())
         await tweet.save()
         user._id.toString() !== tweet.user.toString() &&
            (await Notification.findOneAndDelete(notificationObj))
         tweet.user = await User.findById(tweet.user)
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Tweet unliked successfully',
            tweet,
         })
      }
      tweet.likes.push(user._id)
      await tweet.save()
      user._id.toString() !== tweet.user.toString() && (await Notification.create(notificationObj))
      tweet.user = await User.findById(tweet.user)
      return res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweet liked successfully',
         tweet,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.retweet = async (req, res) => {
   try {
      const user = req.user

      let tweet = await Tweet.findById(req.params.id)
      if (!tweet) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'Tweet not found',
         })
      }

      const notificationObj = {
         sender: user._id,
         receiver: tweet.user,
         type: 'retweet',
         tweet: tweet._id,
      }

      if (tweet.retweetedBy.includes(user._id)) {
         tweet.retweetedBy = tweet.retweetedBy.filter(
            (retweetedBy) => retweetedBy.toString() !== user._id.toString()
         )
         await tweet.save()
         user._id.toString() !== tweet.user.toString() &&
            (await Notification.findOneAndDelete(notificationObj))
         tweet = await Tweet.findById(req.params.id).populate('user')
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Tweet unretweeted successfully',
            tweet,
            isRetweeted: false,
         })
      }
      tweet.retweetedBy.push(user._id)
      await tweet.save()
      user._id.toString() !== tweet.user.toString() && (await Notification.create(notificationObj))
      tweet = await Tweet.findById(req.params.id).populate('user')
      return res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweet retweeted successfully',
         tweet,
         isRetweeted: true,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.deleteTweet = async (req, res) => {
   try {
      const tweet = await Tweet.findById(req.params.id)
      if (!tweet) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'Tweet not found',
         })
      }
      await tweet.remove()
      return res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweet deleted successfully',
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.exploreTweets = async (req, res) => {
   try {
      // random tweets from all users except the logged in user
      const userId = req.params.userId

      const cacheKey = `explore_tweets`

      // Check if the result is already cached
      const cachedResult = cache.get(cacheKey)
      if (cachedResult) {
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Explore tweets fetched successfully from cache',
            tweets: shuffleArray(cachedResult),
         })
      }

      // random tweets
      const tweets = await Tweet.aggregate([
         { $sample: { size: 10 } },
         {
            $match: {
               $and: [
                  {
                     is_Public: true,
                  },
                  {
                     user: {
                        $ne: userId,
                     },
                  },
               ],
            },
         },
         {
            $lookup: {
               from: 'users',
               localField: 'user',
               foreignField: '_id',
               as: 'user',
            },
         },
         {
            $project: {
               _id: 1,
               user: {
                  _id: 1,
                  name: 1,
                  avatar: 1,
               },
               content: 1,
               photo: 1,
            },
         },
      ])

      cache.set(cacheKey, tweets, cacheTTL)

      return res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Tweets fetched successfully',
         tweets,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

module.exports = controller
