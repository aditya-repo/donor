// const mongoose = require("mongoose")
import mongoose, {Document, Model} from "mongoose"

export interface IMessage extends Document {
    senderid: mongoose.Types.ObjectId,
    receiverid: mongoose.Types.ObjectId,
    content: string,
}

const MessageSchema = new mongoose.Schema<IMessage> ({
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
    content: {
        type: String,
        required: true
    },
}, {timestamps: true})


const Message:Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema)

export default Message