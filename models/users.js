const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    registered: {
        type: String
    },
    dob: {
        type: Date
    },
    location: {
        type: String
    },
    coordinate: {
        type: String
    },
    active: {
        type: Boolean,
        default: true
    },
    available: { type: Boolean, default: false }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User