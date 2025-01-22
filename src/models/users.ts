import mongoose , {Model, Schema, Document} from "mongoose"

export interface IUser extends Document{
    name: string,
    phone: number,
    registered: string,
    age?: string,
    state?: string,
    district?: string,
    location? : string
    coordinate?: string
    active: boolean
    visible: boolean
    available: boolean
}

const UserSchema = new Schema<IUser>({
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

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)

export default User