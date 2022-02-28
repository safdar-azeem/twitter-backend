const controller = {};
const STATUS = require('../utils/status');
const Tweet = require('../models/tweet.model');

controller.postTweet = async (req, res) => {
    try {
        const { content, photo, user } = req.body;
        const tweet = new Tweet({
            content,
            photo,
            user,
        });
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


module.exports = controller;