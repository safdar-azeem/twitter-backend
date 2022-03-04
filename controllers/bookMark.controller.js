const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');

controller.addBookmark = async (req, res) => {
	try {
		const { userId, tweetId } = req.params;
		const [user, tweet] = await Promise.all([User.findById(userId), Tweet.findById(tweetId).populate('user')]);
		if (!user || !tweet) {
			return res.status(STATUS.BAD_REQUEST).json({
				status: STATUS.BAD_REQUEST,
				message: 'User or tweet not found',
			});
		}

		if (user.bookmarks.includes(tweet._id)) {
			user.bookmarks = user.bookmarks.filter((id) => id.toString() !== tweet._id.toString());
			tweet.bookmarks = tweet.bookmarks.filter((id) => id.toString() !== user._id.toString());
			await Promise.all([user.save({
				validateBeforeSave: false,
			}), tweet.save()]);
			return res.status(STATUS.SUCCESS).json({
				status: STATUS.SUCCESS,
				message: 'Bookmark removed successfully',
				tweet
			});
		}

		user.bookmarks.push(tweet._id);
		tweet.bookmarks.push(user._id);
		await Promise.all([user.save({
			validateBeforeSave: false,
		}), tweet.save()]);
		res.status(STATUS.SUCCESS).json({
			status: STATUS.SUCCESS,
			message: 'Bookmark added successfully',
			tweet
		});
		
	} catch (err) {
		res.status(STATUS.INTERNAL_SERVER_ERROR).json({
			message: err.message,
		});
	}
};

module.exports = controller;
