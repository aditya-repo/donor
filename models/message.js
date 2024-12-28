const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
    senderid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        required: true
    },
}, {timestamps: true})

const Message = mongoose.model('Message', MessageSchema)

module.exports = Message