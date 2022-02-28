const jwt = require('jsonwebtoken');
const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

controller.getUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Users found',
			users,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

controller.getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		user.password = undefined;
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'User found',
			user,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: "User not found",
		});
	}
};

controller.uploadAvatarOrCover = async (req, res) => {
	try {
		const { files } = req;
		if (!files || !files.image) {
			return res.status(STATUS.BAD_REQUEST).json({
				status: STATUS.BAD_REQUEST,
				message: 'Please provide an image',
			});
		}
		const result = await cloudinary.uploader.upload(files.image.tempFilePath, {
			folder: 'avatarsAndCover',
			use_filename: true,
		});

		fs.unlinkSync(files.image.tempFilePath);

		return res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'uploaded successfully',
			src: result.secure_url,
		});
	} catch (err) {
		return res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			status: STATUS.INTERNAL_SERVER_ERROR,
			message: 'Server error',
		});
	}
};

controller.updateUser = async (req, res) => {
	try{
			const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
			user.password = undefined;
			res.status(STATUS.SUCCESS).json({
				status: STATUS.SUCCESS,
				message: 'User updated successfully',
				user,
			});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: "User not found",
		});
	}
};

module.exports = controller;