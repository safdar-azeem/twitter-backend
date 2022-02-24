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



module.exports = controller;
