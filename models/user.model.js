const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(value) {
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    throw new Error('Email is not valid');
                } 
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        validate: {
            validator: function(value) {
                if (value.length < 6) {
                    throw new Error({
                        message: 'Password must be at least 6 characters long',
                    });
                }
            },
            } 
    },
    avatar: {
        type: String
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    total_Followers: {
        type: Number,
        default: 0
    },
    total_Following: {
        type: Number,
        default: 0
    },
    total_Tweets: {
        type: Number,
        default: 0
    },
    total_Notifications: {
        type: Number,
        default: 0
    },
    total_Messages: {
        type: Number,
        default: 0
    },
    is_Verified: {
        type: Boolean,
        default: false
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;