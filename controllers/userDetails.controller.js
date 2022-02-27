const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');

controller.uploadAvatar = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(STATUS.NOT_FOUND).json({
				message: 'User not found',
			});
		}

		if (req.file) {
			user.avatar = req.file.path;
		}

		await user.save();
		res.status(STATUS.SUCCESS).json(user);
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

module.exports = controller;
