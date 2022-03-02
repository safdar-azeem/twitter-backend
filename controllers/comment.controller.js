const controller = {};
const STATUS = require('../utils/status');
const User = require('../models/user.model');
const Tweet = require('../models/tweet.model');
const Comment = require('../models/comment.model');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


controller.postComment = async (req, res) => {
    try {
        const { content, tweetId, userId } = req.body;
        const tweet = await Tweet.findById(tweetId);
        const user = await User.findById(userId);
        if (!tweet || !user) {
            return res.status(STATUS.BAD_REQUEST).json({
                status: STATUS.BAD_REQUEST,
                message: 'Tweet or user not found',
            });
        }
        const comment = new Comment({
            content,
            user,
            tweet,
        });
        await comment.save();
        tweet.comments.push(comment);
        await tweet.save();
        res.status(STATUS.SUCCESS).json({
            status: STATUS.SUCCESS,
            message: 'Comment posted successfully',
            comment,
        });
    } catch (err) {
        res.status(STATUS.INTERNAL_SERVER_ERROR).json({
            message: err.message,
        });
    }
};


module.exports = controller;
