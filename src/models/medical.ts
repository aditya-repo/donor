import mongoose, { Model, Document } from "mongoose"

export interface IMedical extends Document {
    userid: mongoose.Schema.Types.ObjectId;
    bloodGroup? : "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    tattoo? : boolean;
    bloodType? : 'PCV' | 'Whole Blood' | 'Platelets' | 'Plasma' | 'R.B.C' | 'S.D.P (Single Donor Platlets' | "Others"
    diabetic? : boolean
    alcohol? : boolean
    tobacco? : boolean
    allergies? : string[]
    diseases? : string[]
    donated? : number
}

const MedicalSchema = new mongoose.Schema<IMedical>({
    userid: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bloodGroup: {
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    tattoo: { type: Boolean, default: false },
    bloodType: { type: String },
    diabetic: { type: Boolean },
    alcohol: { type: Boolean },
    tobacco: { type: Boolean },
    allergies: [{ type: String }],
    diseases: [{ type: String }],
    donated: {
        type: Number,
        default: 0
    }
}, { timestamps: true }
)


const MedicalData: Model<IMedical> = mongoose.model<IMedical>("MedicalData", MedicalSchema)

export default MedicalData