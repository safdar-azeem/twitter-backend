const fs = require('fs')
const path = require('path')
const STATUS = require('../utils/status')
const cloudinary = require('cloudinary').v2

const controller = {}

controller.uploadPhoto = async (req, res) => {
   try {
      const { files } = req

      if (!files || !files.image) {
         return res.status(STATUS.BAD_REQUEST).json({
            status: STATUS.BAD_REQUEST,
            message: 'Please provide an image',
         })
      }

      cloudinary.config({
         cloud_name: process.env.CLOUDINARY_NAME,
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_API_SECRET,
      })

      const result = await cloudinary.uploader.upload(files.image.tempFilePath, {
         folder: 'twitter',
      })

      fs.unlinkSync(path.resolve(process.cwd(), files.image.tempFilePath))

      return res.status(STATUS.SUCCESS).json({
         status: STATUS.SUCCESS,
         message: 'uploaded successfully',
         src: result.secure_url,
      })
   } catch (err) {
      return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
         status: STATUS.INTERNAL_SERVER_ERROR,
         message: 'Server error',
      })
   }
}

module.exports = controller
