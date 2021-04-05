const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TrendSchema = new Schema({
   name: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   count: {
      type: Number,
      default: 1,
   },
   tweets: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Tweet',
      },
   ],
})

const Trend = mongoose.model('Trend', TrendSchema)

module.exports = Trend
