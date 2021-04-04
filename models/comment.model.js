const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
   content: {
      type: String,
      trim: true,
   },
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
   },
   tweet: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
      required: [true, 'Tweet is required'],
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
   replies: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Comment',
      },
   ],
   is_Pinned: {
      type: Boolean,
      default: false,
   },
})

const commentModel = mongoose.model('Comment', commentSchema)

module.exports = commentModel
