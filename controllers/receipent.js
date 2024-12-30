const MedicalData = require("../models/medical");
const Recepient = require("../models/receipent");
const User = require("../models/users");
const schemaError = require("../util/joiError");
const { askBloodDonationSchema } = require("../validator/receipent");

const searchDonorList = async (req, res) => {
    const { query } = req.body
    console.log(req.body);

    const donorlist = await MedicalData.find({ bloodType: { $regex: query, $options: 'i' } }).select('-donated').populate('userid', '-phone -active')

    if (!donorlist) {
        return res.status(404).json(donorlist)
    }
    res.json(donorlist)
}

const requestBlood = async (req, res) => {

    const { contactname, contactnumber, patientname, patientcontact, patientage, bloodGroup, bloodType, unitcount, status, requestnote, state, district, city, landmark, hospitalname } = req.body;

    const { error } = askBloodDonationSchema.validate(req.body)

    if (error) {
        const err = schemaError(error)
        return res.json(err)
    }

    const payload = { contactname, contactnumber, patientname, patientcontact, patientage, bloodGroup, bloodType, unitcount, status, requestnote, state, district, city, landmark, hospitalname, active: true }

    const newBloodRequest = new Recepient(payload)
    newBloodRequest.save()
}

const getFormRequest = async (req, res) => {
    const { formid } = req.params
    const response = await Recepient.findOne({ _id: formid })
    res.json({ message: response, mstatus: 200 }).status(200)
}

const updateRequestBlood = async (req, res) => {

    const { contactname, contactnumber, patientname, patientcontact, patientage, bloodGroup, bloodType, unitcount, status, requestnote, state, district, city, landmark, hospitalname } = req.body;
    const { formid } = req.params

    const { error } = askBloodDonationSchema.validate(req.body)

    if (error) {
        const err = schemaError(error)
        return res.json(err)
    }

    const payload = { contactname, contactnumber, patientname, patientcontact, patientage, bloodGroup, bloodType, unitcount, status, requestnote, state, district, city, landmark, hospitalname, active: true }

    const response = await Recepient.findOneAndUpdate({ _id: formid }, payload, { new: true })

    return res.status(201).json(response)
}

const deleteRequestForm = async (req, res) => {
    const { formid } = req.params

    await Recepient.findOneAndUpdate({ _id: formid }, { active: false })

    res.json({ message: "Form deleted successfully", mstatus: 204 }).status(204)
}

const donorData = async (req, res) => {

    const response = await User.aggregate([
        {
            $group: {
                _id: "$state",
                totaldonor: { $sum: 1 },
                activedonor: { $sum: { $cond: [{ $eq: ["$active", true] } , 1, 0] } }
            }
        },
        {
            $project: {
                _id: 0,
                state: "$_id",
                totaldonor: 1,
                activedonor: 1
            }
        }
    ])

    res.json(response)
}

module.exports = { searchDonorList, requestBlood, updateRequestBlood, deleteRequestForm, getFormRequest, donorData }