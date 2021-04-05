const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
   retweetedBy: [
      {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
   ],
   is_Public: {
      type: Boolean,
      default: true,
   },
   is_Pinned: {
      type: Boolean,
      default: false,
   },
   bookmarks: [
      {
         type: Schema.Types.ObjectId,
         ref: 'User',
      },
   ],
})

const tweetModel = mongoose.model('Tweet', tweetSchema)

module.exports = tweetModel
