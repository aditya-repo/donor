import mongoose, {Document, Model, Schema} from "mongoose"

export interface IRecepient extends Document {
    contactname: string;
    contactnumber: string;
    patientname: string;
    patientcontact: string;
    patientage: string;
    bloodGroup:  "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
    bloodType: 'PCV' | 'Whole Blood' | 'Platelets' | 'Plasma' | 'R.B.C' | 'S.D.P (Single Donor Platlets' | "Others";
    unitcount: number;
    status: 'Rush' | 'Urgent' | 'Planned' | 'Other';
    requestnote: string,
    state: string,
    district: string,
    city: string,
    landmark: string,
    hospitalname: string,
    requirementdate: Date
}


const RecepientSchema = new mongoose.Schema<IRecepient>({
    contactname: {type:String},
    contactnumber: {type: String},
    patientname: {type: String},
    patientcontact: {type: String},
    patientage: {type: String},
    bloodGroup: {enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']},
    bloodType: {enum: ['PCV', 'Whole Blood', 'Platelets', 'Plasma', 'R.B.C', 'S.D.P (Single Donor Platlets', "Others"]},
    unitcount: {type: Number},
    status: {enum: ['Rush', 'Urgent', 'Planned', 'Other']},
    requestnote: {type: String},
    state: {type: String},
    district: {type: String},
    city: {type: String},
    landmark: {type: String},
    hospitalname: {type: String},
    requirementdate: {type: Date}
})

const Recepient: Model<IRecepient> = mongoose.model<IRecepient>('Receipent', RecepientSchema)

export default Recepient