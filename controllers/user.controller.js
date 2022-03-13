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


controller.followUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		const userToFollow = await User.findById(req.params.followingId);
		if (!user || !userToFollow) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'User not found',
			});
		}
		if (user.following.includes(req.params.followingId)) {
			user.following.pull(req.params.followingId);
			userToFollow.followers.pull(req.params.userId);
		} else {
			user.following.push(req.params.followingId);
			userToFollow.followers.push(req.params.userId);
		}

		await user.save({
			validateBeforeSave: false,
		});
		await userToFollow.save({
			validateBeforeSave: false,
		});
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'User updated successfully',
			user,
			userToFollow,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

controller.getSuggestedUsers = async (req, res) => {
	try {
		const user = await User.findById(req.params.userId);
		if (!user) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'User not found',
			});
		}
		const pagination = {
			page: req.query.page || 1,
			limit: req.query.limit || 5,
		};
		const users = await User.find({
			_id: {
				$nin: [req.params.userId, ...user.following],
			},
		})
			.skip((pagination.page - 1) * pagination.limit)
			.limit(pagination.limit)
			.sort({ date_Created: -1 })
			.select('-password');

		if (!users) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'Users not found',
			});
		}

		console.log(users);

		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Suggested users found',
			users,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};


controller.getUserFollowersOrFollowing = async (req, res) => {
	try {
		const type = req.params.type
		const user = await User.findById(req.params.userId);
		if (!user) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'User not found',
			});
		}
		const pagination = {
			page: req.query.page || 1,
			limit: req.query.limit || 5,
		};
		const users = await User.find({
			_id: {
				$in: type == 'following' ? user.following : user.followers,
			},
		})
			.skip((pagination.page - 1) * pagination.limit)
			.limit(pagination.limit)
			.sort({ updatedAt: -1 })
			.select('-password');

		if (!users) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'Users not found',
			});
		}

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
}

module.exports = controller;