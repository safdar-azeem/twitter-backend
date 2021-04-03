const jwt = require('jsonwebtoken')
const STATUS = require('../utils/status')
const User = require('../models/user.model')

const authMiddleware = async (req, res, next) => {
   try {
      const authHeader = req.headers.authorization

      if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') {
         return res.status(STATUS.UNAUTHORIZED).json({
            message: 'No token provided.',
         })
      }

      const token = req.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
      const { _id } = decodedToken
      const user = await User.findById(_id)
      if (!user) {
         return res.status(STATUS.NOT_FOUND).json({
            status: STATUS.NOT_FOUND,
            message: 'User not found',
         })
      } else {
         req.user = user
         next()
      }
   } catch (err) {
      res.status(STATUS.UNAUTHORIZED).json({
         status: STATUS.UNAUTHORIZED,
         message: 'Invalid token',
      })
   }
}

module.exports = authMiddleware
