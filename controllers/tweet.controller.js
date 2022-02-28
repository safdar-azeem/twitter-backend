const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

controller.uploadTweetPhoto = async (req, res) => {
	try {
		const { files } = req;
		if (!files || !files.image) {
			return res.status(STATUS.BAD_REQUEST).json({
				status: STATUS.BAD_REQUEST,
				message: 'Please provide an image',
			});
		}
		const result = await cloudinary.uploader.upload(files.image.tempFilePath, {
			folder: 'tweets',
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

controller.postTweet = async (req, res) => {
	try {
		const tweet = new Tweet(req.body);
		await tweet.save();
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Tweet posted successfully',
			tweet,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

controller.getTweets = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		const allIds = [...user.following, user._id];
		const tweets = await Tweet.find({
			user: {
				$in: allIds,
			},
		}).populate('user').sort({ createdAt: -1 });
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Tweets fetched successfully',
			tweets,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

module.exports = controller;
