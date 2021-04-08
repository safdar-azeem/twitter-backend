const express = require('express')
const router = express.Router()
const controller = require('../controllers/notification.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/get/:userId', authMiddleware, controller.getNotifications)
router.get('/count/:userId', authMiddleware, controller.countUnSeenNotifications)
router.put('/markAsSeen/:userId', authMiddleware, controller.markAsSeen)
router.put('/markAsRead/:userId/:notificationId', authMiddleware, controller.markAsRead)

module.exports = router
