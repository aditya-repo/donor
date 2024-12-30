const mongoose = require("mongoose")

const RecepientSchema = new mongoose.Schema({
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

const Recepient = mongoose.model('Receipent', RecepientSchema)

module.exports = Recepient