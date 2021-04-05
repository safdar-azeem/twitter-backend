const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashPassword, comparePassword } = require('../utils/hashPassword')

const userSchema = new Schema({
   name: {
      type: String,
      trim: true,
      required: [true, 'Name is required'],
   },
   email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exist'],
      trim: true,
      validate: {
         validator: function (value) {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
               throw new Error('Email is not valid')
            }
         },
      },
   },
   password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      maxlength: 20,
      validate: {
         validator: function (value) {
            if (value.length < 6) {
               throw new Error({
                  message: 'Password must be at least 6 characters long',
               })
            }
         },
      },
   },
   avatar: {
      type: String,
      default: null,
   },
   location: {
      type: String,
      default: null,
   },
   website: {
      type: String,
      default: null,
   },
   cover: {
      type: String,
      default: null,
   },
   bio: {
      type: String,
      default: null,
   },
   date_Of_birth: {
      type: Date,
      default: null,
   },
   date_Created: {
      type: Date,
      default: Date.now,
   },
   following: [
      {
         type: Schema.Types.ObjectId,
         ref: 'User',
         updatedAt: {
            type: Date,
            default: Date.now,
         },
      },
   ],
   followers: [
      {
         type: Schema.Types.ObjectId,
         ref: 'User',
         updatedAt: {
            type: Date,
            default: Date.now,
         },
      },
   ],
   total_Notifications: {
      type: Number,
      default: 0,
   },
   total_Messages: {
      type: Number,
      default: 0,
   },
   is_Verified: {
      type: Boolean,
      default: false,
   },
   tweets: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Tweet',
      },
   ],
   bookmarks: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Tweet',
      },
   ],
})

userSchema.pre('save', async function (next) {
   try {
      if (this.isModified('password')) {
         this.password = await hashPassword(this.password)
      }
      next()
   } catch (err) {
      next(err)
   }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
   try {
      const isMatch = await comparePassword(candidatePassword, this.password)
      return isMatch
   } catch (err) {
      throw new Error(err)
   }
}

userSchema.methods.generateAuthToken = function () {
   const token = jwt.sign(
      {
         _id: this._id,
      },
      process.env.SECRET_KEY
   )
   return token
}

userSchema.statics.findByToken = async function (token) {
   try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const user = await this.findOne({
         _id: decoded._id,
      })
      return user
   } catch (err) {
      throw new Error(err)
   }
}

const User = mongoose.model('User', userSchema)

module.exports = User
