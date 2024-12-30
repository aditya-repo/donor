const mongoose = require("mongoose")

const MedicalSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bloodGroup: {
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    tattoo: {type: Boolean, default: false},
    bloodType: {type: String},
    diabetic: { type: Boolean },
    alcohol: { type: Boolean },
    tobacco: { type: Boolean },
    allergies: [{ type: String }],
    diseases: [{ type: String }],
    donated: {
        type: Number,
        default : 0
    }
}, { timestamps: true })

const MedicalData = mongoose.model("MedicalData", MedicalSchema)

module.exports = MedicalData