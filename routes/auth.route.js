const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/signup', controller.signup)
router.post('/login', controller.login)
router.get('/logedIn', authMiddleware, controller.logedIn)

module.exports = router
