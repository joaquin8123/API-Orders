const mongoose = require('mongoose')
const schema = mongoose.Schema

const UserSchema = schema(
    {
        email: { type: String, required: 'Email required.', trim: true, unique: true, lowercase: true },
        password: { type: String, required: 'Password required.', trim: true },
        firstName: {
            type: String,
            required: 'First Name required.'
        },
        lastName: {
            type: String,
            required: 'Last Name required.'
        },
        phone: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        },
        image: {
            type: String,
            trim: true
        },
        token: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', UserSchema)