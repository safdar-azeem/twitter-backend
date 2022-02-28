const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tweetSchema = new Schema({
	content: {
		type: String,
		trim: true,
	},
	photo: {
		type: String,
		default: null,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User is required'],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
	retweets: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Tweet',
		},
	],
	is_public: {
		type: Boolean,
		default: true,
	},
	is_pinned: {
		type: Boolean,
		default: false,
	},
});



const tweetModel = mongoose.model('Tweet', tweetSchema);

module.exports = tweetModel;
