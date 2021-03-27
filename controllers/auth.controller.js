const controller = {}
const STATUS = require('../utils/status')
const User = require('../models/user.model')

controller.signup = async (req, res) => {
   try {
      const isUserExist = await User.findOne({ email: req.body.email })
      if (isUserExist) {
         return res.status(STATUS.CONFLICT).json({
            message: 'User already exist',
         })
      }

      const user = await User.create(req.body)
      res.status(STATUS.CREATED).json({
         status: STATUS.CREATED,
         message: 'User created successfully',
         user: user,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.login = async (req, res) => {
   try {
      if (!req.body.email || !req.body.password) {
         return res.status(STATUS.BAD_REQUEST).json({
            message: 'Please provide email and password',
         })
      }

      const user = await User.findOne({ email: req.body.email })

      if (!user) {
         res.status(STATUS.NOT_FOUND).json({
            message: 'User not found',
         })
      } else {
         const isMatch = await user.comparePassword(req.body.password)
         if (isMatch) {
            const token = user.generateAuthToken()
            res.status(STATUS.SUCCESS).json({
               message: 'User logged in successfully',
               token: token,
            })
         } else {
            res.status(STATUS.UNAUTHORIZED).json({
               message: 'Invalid password',
            })
         }
      }
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

controller.logedIn = async (req, res) => {
   try {
      res.status(STATUS.SUCCESS).json({
         message: 'User logged in successfully',
         user: req.user,
      })
   } catch (err) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         message: err.message,
      })
   }
}

module.exports = controller
