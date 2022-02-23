const jwt = require('jsonwebtoken');
const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');

controller.getUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(STATUS.SUCCESS).json(users);
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
		res.status(STATUS.SUCCESS).json(user);
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: "User not found",
		});
	}
};

controller.createUser = async (req, res) => {
	try {
		const user = await User.create(req.body);
		res.status(STATUS.CREATED).json(user);
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

controller.loginUser = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			res.status(STATUS.NOT_FOUND).json({
				message: 'User not found',
			});
		} else {
			const isMatch = await user.comparePassword(req.body.password);
			if (isMatch) {
				const token = jwt.sign(
					{
						id: user._id,
						email: user.email,
						name: user.name,
					},
					process.env.SECRET_KEY,
				);
				res.status(STATUS.SUCCESS).json({
					message: 'User logged in successfully',
					token: token,
					user: user,
				});
			} else {
				res.status(STATUS.UNAUTHORIZED).json({
					message: 'Invalid password',
				});
			}
		}
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

module.exports = controller;
