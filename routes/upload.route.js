const express = require('express')
const router = express.Router()
const controller = require('../controllers/upload.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/photo', authMiddleware, controller.uploadPhoto)

module.exports = router
