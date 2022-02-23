const controller = {}
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

controller.createUser = async (req, res) => {
    console.log(req.body);
	try {
		const user = await User.create(req.body);
		res.status(STATUS.CREATED).json(user);
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};


module.exports = controller;