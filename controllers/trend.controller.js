const controller = {}
const STATUS = require('../utils/status')
const Trend = require('../models/trend.model')
const cache = require('../config/cache')

const cacheTTL = 21600 // 6 hour

controller.addTrend = async (req, res) => {
   try {
      const { name, tweetId } = req.body
      const trend = await Trend.findOne({ name })
      if (trend) {
         trend.count += 1
         trend.tweets.push(tweetId)
         await trend.save()
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Trend added successfully',
            trend,
         })
      } else {
         const newTrend = new Trend({ name })
         newTrend.tweets.push(tweetId)
         await newTrend.save()
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Trend added successfully',
            trend: newTrend,
         })
      }
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getTopTrends = async (req, res) => {
   try {
      const cacheKey = 'getTopTrends'

      const cachedResult = cache.get(cacheKey)
      if (cachedResult) {
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Trends fetched successfully from cache',
            trends: cachedResult,
         })
      }

      const trends = await Trend.find({ count: { $gt: 0 } })
         .sort({ count: -1 })
         .limit(5)

      cache.set(cacheKey, trends, cacheTTL)

      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Trends fetched successfully',
         trends,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.findTrend = async (req, res) => {
   try {
      const name = req.params.name
      const userId = req.params.userId
      const trend = await Trend.findOne({
         name,
      }).populate({
         path: 'tweets',
         populate: {
            path: 'user',
         },
      })
      if (trend) {
         trend.tweets = trend.tweets.filter(
            (tweet) => tweet.user._id.toString() === userId || tweet.is_Public
         )
         res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Trend fetched successfully',
            trend,
         })
      } else {
         res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'Trend not found',
         })
      }
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.deleteTend = async (req, res) => {
   try {
      const { name, tweet } = req.params

      const trend = await Trend.findOne({ name }).populate('tweets')

      if (!trend) {
         return res.status(STATUS.NOT_FOUND).json({
            message: 'Trend not found',
         })
      }

      if (trend.tweets.length === 1 && trend.tweets[0].toString() === tweet) {
         await trend.remove()
      } else {
         trend.count--
         trend.tweets.pull(tweet)
         await trend.save()
      }

      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Trend deleted successfully',
         trend,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

module.exports = controller
