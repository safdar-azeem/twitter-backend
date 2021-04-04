const mongoose = require('mongoose')
const Schema = mongoose.Schema

const notificationSchema = new Schema({
   type: {
      type: String,
      enum: ['like', 'reply', 'retweet', 'follow', 'mention', 'comment'],
      required: [true, 'Type is required'],
   },
   sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
   },
   receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
   },
   tweet: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
   isRead: {
      type: Boolean,
      default: false,
   },
   isSeen: {
      type: Boolean,
      default: false,
   },
})

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification
