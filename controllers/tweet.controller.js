const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const Comment = require('../models/comment.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const Notification = require('../models/notification.model');

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
			$or: [
				{
					$and: [
						{
							$or: [
								{
									user: {
										$in: allIds,
									},
								},
								{
									retweetedBy: {
										$in: allIds,
									},
								},
							],
						},
						{
							$or: [
								{
									is_Public: true,
								},
								{
									user: req.params.id,
								},
							],
						},
					],
				},
				{
					user: {
						$in: req.params.id,
					},
					is_Public: true,
				},
			],
		})
			.populate('user')
			.sort({ createdAt: -1 });
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

controller.getUserTweets = async (req, res) => {
	try {
		const tweets = await Tweet.find({
			$or: [
				{
					user: req.params.id,
				},
				{
					$and: [
						{
							retweetedBy: req.params.id,
						},
						{
							is_Public: true,
						},
					],
				},
			],
		})
			.populate('user')
			.sort({ createdAt: -1 });
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

controller.getUserMediaTweets = async (req, res) => {
	try {
		const tweets = await Tweet.find({
			$or: [
				{
					user: req.params.id,
				},
				{
					$and: [
						{
							retweetedBy: req.params.id,
						},
						{
							is_Public: true,
						},
					],
				},
			],
			photo: {
				$ne: null,
			},
		})
			.populate('user')
			.sort({ createdAt: -1 });
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

controller.getTweetsLikeByUser = async (req, res) => {
	try {
		const tweets = await Tweet.find({
			likes: req.params.id,
			$or: [
				{
					user: req.params.id
				},
				{
					is_Public: true,
				},
			],
		})
			.populate('user')
			.sort({ createdAt: -1 });
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

controller.getTweetById = async (req, res) => {
	try {
		const tweet = await Tweet.findById(req.params.id)
			.populate('user')

		if (!tweet) {
			return res.status(STATUS.NOT_FOUND).json({
				message: 'Tweet not found',
			});
		}

		tweet.comments = await Comment.find({
			_id: tweet.comments,
		}).populate('user')
			
		
			
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Tweet fetched successfully',
			tweet,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

controller.likeTweet = async (req, res) => {
	try {
		const tweet = await Tweet.findById(req.params.id);
		if (!tweet) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'Tweet not found',
			});
		}
		const user = await User.findById(req.params.userId);
		if (!user) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'User not found',
			});
		}
		
		const notificationObj = {
			sender: user._id,
			receiver: tweet.user,
			type: 'like',
			tweet: tweet._id,
		};
		
		if (tweet.likes.includes(user._id)) {
			tweet.likes = tweet.likes.filter((like) => like.toString() !== user._id.toString());
			await tweet.save();
			user._id.toString() !== tweet.user.toString() && await Notification.findOneAndDelete(notificationObj);
			tweet.user = await User.findById(tweet.user);
			return res.status(STATUS.SUCCESS).json({
				status: STATUS.SUCCESS,
				message: 'Tweet unliked successfully',
				tweet,
			});
		}
		tweet.likes.push(user._id);
		await tweet.save();
		user._id.toString() !== tweet.user.toString() && await Notification.create(notificationObj);
		tweet.user = await User.findById(tweet.user);
		return res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Tweet liked successfully',
			tweet,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

controller.retweet = async (req, res) => {
	try {
		let tweet = await Tweet.findById(req.params.id);
		if (!tweet) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'Tweet not found',
			});
		}
		const user = await User.findById(req.params.userId);
		if (!user) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'User not found',
			});
		}

		const notificationObj = {
			sender: user._id,
			receiver: tweet.user,
			type: 'retweet',
			tweet: tweet._id,
		};

		if (tweet.retweetedBy.includes(user._id)) {
			tweet.retweetedBy = tweet.retweetedBy.filter(
				(retweetedBy) => retweetedBy.toString() !== user._id.toString(),
			);
			await tweet.save();
			user._id.toString() !== tweet.user.toString() && await Notification.findOneAndDelete(notificationObj);
			tweet = await Tweet.findById(req.params.id).populate('user');
			return res.status(STATUS.SUCCESS).json({
				status: STATUS.SUCCESS,
				message: 'Tweet unretweeted successfully',
				tweet,
				isRetweeted: false,
			});
		}
		tweet.retweetedBy.push(user._id);
		await tweet.save();
		user._id.toString() !== tweet.user.toString() && await Notification.create(notificationObj);	
		tweet = await Tweet.findById(req.params.id).populate('user');
		return res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Tweet retweeted successfully',
			tweet,
			isRetweeted: true,
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};


controller.deleteTweet = async (req, res) => {
	try {
		const tweet = await Tweet.findById(req.params.id);
		if (!tweet) {
			return res.status(STATUS.NOT_FOUND).json({
				status: STATUS.NOT_FOUND,
				message: 'Tweet not found',
			});
		}
		await tweet.remove();
		return res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Tweet deleted successfully',
		});
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

module.exports = controller;
