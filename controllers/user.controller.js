const controller = {}
const jwt = require('jsonwebtoken')
const STATUS = require('../utils/status')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const cache = require('../config/cache')

const cacheTTL = 86400 // 1 day

controller.getUsers = async (req, res) => {
   try {
      const users = await User.find({})
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Users found',
         users,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getUserById = async (req, res) => {
   try {
      const user = await User.findById(req.params.id)
      user.password = undefined
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'User found',
         user,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: 'User not found',
      })
   }
}

controller.findUsersByName = async (req, res) => {
   try {
      const users = await User.find({
         name: {
            $regex: req.params.name,
            $options: 'i',
         },
      }).select(['name', 'avatar', 'bio'])
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Users found',
         users,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.updateUser = async (req, res) => {
   try {
      const { _id } = req.user
      const user = await User.findByIdAndUpdate(_id, req.body, { new: true })
      user.password = undefined
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'User updated successfully',
         user,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: 'User not found',
      })
   }
}

controller.followUser = async (req, res) => {
   try {
      const user = req.user
      const userToFollow = await User.findById(req.params.followingId)

      if (!userToFollow) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'User not found',
         })
      }

      const notificationObj = {
         sender: user._id,
         receiver: req.params.followingId,
         type: 'follow',
      }

      if (user.following.includes(req.params.followingId)) {
         user.following.pull(req.params.followingId)
         userToFollow.followers.pull(user._id)
         await Notification.findOneAndDelete(notificationObj)
      } else {
         user.following.push(req.params.followingId)
         userToFollow.followers.push(user._id)
         const notification = new Notification(notificationObj)
         await notification.save()
      }

      await user.save({
         validateBeforeSave: false,
      })
      await userToFollow.save({
         validateBeforeSave: false,
      })
      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'User updated successfully',
         user,
         userToFollow,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getSuggestedUsers = async (req, res) => {
   try {
      const user = req.user

      const cacheKey = `suggested_users_${user._id}_${req.query.page || 1}_${req.query.limit || 5}`
      const cachedResult = cache.get(cacheKey)
      if (cachedResult) {
         return res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Suggested users found',
            users: cachedResult,
         })
      }

      const pagination = {
         page: req.query.page || 1,
         limit: req.query.limit || 5,
      }

      const users = await User.find({
         _id: {
            $nin: [user._id, ...user.following],
         },
      })
         .skip((pagination.page - 1) * pagination.limit)
         .limit(pagination.limit)
         .sort({ date_Created: -1 })
         .select('-password')

      if (!users) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'Users not found',
         })
      }

      cache.set(cacheKey, users, cacheTTL)

      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Suggested users found',
         users,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.getUserFollowersOrFollowing = async (req, res) => {
   try {
      const type = req.params.type
      const user = await User.findById(req.params.userId)
      if (!user) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'User not found',
         })
      }
      const pagination = {
         page: req.query.page || 1,
         limit: req.query.limit || 5,
      }

      const query = {
         _id: {
            $in: type == 'following' ? user.following : user.followers,
         },
      }

      const users = await User.find(query)
         .skip((pagination.page - 1) * pagination.limit)
         .limit(pagination.limit)
         .sort({ updatedAt: -1 })
         .select('-password')

      // count the number of users
      const count = await User.countDocuments(query)

      if (!users) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'Users not found',
         })
      }

      res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'Users found',
         users,
         count,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

module.exports = controller
