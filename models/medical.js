const mongoose = require("mongoose")

const MedicalSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bloodType: {
        type: String
    },
    diabetic: { type: Boolean },
    allergies: [{ type: String }],
    alcohol: { type: Boolean },
    tobacco: { type: Boolean },
    diseases: [{ type: String }],
    donated: {
        type: Number,
        default : 0
    }
}, { timestamps: true })

const MedicalData = mongoose.model("MedicalData", MedicalSchema)

module.exports = MedicalData