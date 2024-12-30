const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     unique: true,
    //     required: true
    // },
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
    age: {
        type: Number
    },
    state: {
        type:String
    },
    district: {
        type: String
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
    visible: {
        type: Boolean,
        default: true
    },
    available: { type: Boolean, default: false, required: true }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

module.exports = User