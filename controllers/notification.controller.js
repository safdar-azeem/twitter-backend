const controller = {}
const STATUS = require('../utils/status')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')

controller.getNotifications = async (req, res) => {
   try {
      const user = User.findById(req.params.userId)
      if (!user) {
         return res.status(STATUS.NOT_FOUND).json({
            message: 'User not found',
         })
      }
      const notifications = await Notification.find({
         receiver: req.params.userId,
      })
         .populate({
            path: 'sender',
            select: 'name avatar followers following',
         })
         .populate({
            path: 'tweet',
            select: 'photo content',
            populate: {
               path: 'user',
               select: 'name avatar',
            },
         })
         .sort({ createdAt: -1 })
      return res.status(STATUS.SUCCESS).json({
         message: 'Get notifications successfully',
         notifications,
      })
   } catch (err) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         status: STATUS.INTERNAL_SERVER_ERROR,
         message: 'Server error',
      })
   }
}

controller.countUnSeenNotifications = async (req, res) => {
   try {
      const user = User.findById(req.params.userId)
      if (!user) {
         return res.status(STATUS.NOT_FOUND).json({
            message: 'User not found',
         })
      }
      const count = await Notification.countDocuments({
         receiver: req.params.userId,
         isSeen: false,
      })
      return res.status(STATUS.SUCCESS).json({
         message: 'Get notifications successfully',
         count,
      })
   } catch (err) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         status: STATUS.INTERNAL_SERVER_ERROR,
         message: 'Server error',
      })
   }
}

controller.markAsSeen = async (req, res) => {
   try {
      const user = User.findById(req.params.userId)
      if (!user) {
         return res.status(STATUS.NOT_FOUND).json({
            message: 'User not found',
         })
      }
      const notifications = await Notification.updateMany(
         {
            receiver: req.params.userId,
            isSeen: false,
         },
         {
            $set: {
               isSeen: true,
            },
         }
      )
      return res.status(STATUS.SUCCESS).json({
         message: 'Mark as read successfully',
         notifications,
      })
   } catch (err) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         status: STATUS.INTERNAL_SERVER_ERROR,
         message: 'Server error',
      })
   }
}

controller.markAsRead = async (req, res) => {
   try {
      const user = User.findById(req.params.userId)
      if (!user) {
         return res.status(STATUS.NOT_FOUND).json({
            message: 'User not found',
         })
      }
      const notification = await Notification.findById(req.params.notificationId)
      if (!notification) {
         return res.status(STATUS.NOT_FOUND).json({
            message: 'Notification not found',
         })
      }
      const updatedNotification = await Notification.updateOne(
         {
            _id: req.params.notificationId,
         },
         {
            $set: {
               isRead: true,
            },
         }
      )
      return res.status(STATUS.SUCCESS).json({
         message: 'Mark as read successfully',
         notification: updatedNotification,
      })
   } catch (err) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         status: STATUS.INTERNAL_SERVER_ERROR,
         message: 'Server error',
      })
   }
}

module.exports = controller
