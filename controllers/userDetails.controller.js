const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

controller.uploadAvatar = async (req, res) => {
	try {
		const { files } = req;
		if (!files ||  !files.image) {
			return res.status(STATUS.BAD_REQUEST).json({
				status: STATUS.BAD_REQUEST,
				message: 'Please provide an image',
			});
		}
		const result = await cloudinary.uploader.upload(files.image.tempFilePath, {
			folder: 'avatars',
			use_filename: true,
		});

		fs.unlinkSync(files.image.tempFilePath);

		return res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Avatar uploaded successfully',
			src: result.secure_url,
		});
	} catch (err) {
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			status: STATUS.INTERNAL_SERVER_ERROR,
			message: 'Server error',
		});
	}
};


controller.editUserDetails = async (req, res) => {
	try {
		const { userId } = req.params;
		let user = await User.findById(userId);
		if (!user) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'User not found',
			});
		}
		
		for (let key in req.body) {
			user[key] = req.body[key];
		}

		await user.save();
		
		return res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'User details updated successfully',
			user,
		});
	} catch (err) {
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			status: STATUS.INTERNAL_SERVER_ERROR,
			message: err.message,
		});
	}
};


module.exports = controller;
