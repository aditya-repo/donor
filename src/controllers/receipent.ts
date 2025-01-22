import { Request, Response } from "express";
import MedicalData from "../models/medical";
import Recepient from "../models/receipent"
import User from "../models/users"
import schemaError from "../util/joiError"
import { askBloodDonationSchema } from "../validator/receipent"

const searchDonorList = async (req: Request, res:Response):Promise<Response> => {
    const { query } = req.body
    console.log(req.body);

    const donorlist = await MedicalData.find({ bloodType: { $regex: query, $options: 'i' } }).select('-donated').populate('userid', '-phone -active')

    if (!donorlist) {
        return res.status(404).json(donorlist)
    }
    return res.json(donorlist)
}

const requestBlood = async (req: Request, res:Response):Promise<Response> => {

    const { contactname, contactnumber, patientname, patientcontact, patientage, bloodGroup, bloodType, unitcount, status, requestnote, state, district, city, landmark, hospitalname } = req.body;

    const { error } = askBloodDonationSchema.validate(req.body)

    if (error) {
        const err = schemaError(error)
        return res.json(err)
    }

    const payload = { contactname, contactnumber, patientname, patientcontact, patientage, bloodGroup, bloodType, unitcount, status, requestnote, state, district, city, landmark, hospitalname, active: true }

    const newBloodRequest = new Recepient(payload)
    newBloodRequest.save()

    return res.json({ message: "Blood Request Submitted", mstatus: 200 }).status(200)

}

const getFormRequest = async (req: Request, res:Response):Promise<Response> => {
    const { formid } = req.params
    const response = await Recepient.findOne({ _id: formid })
    return res.json({ message: response, mstatus: 200 }).status(200)
}

const updateRequestBlood = async (req: Request, res:Response):Promise<Response> => {

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

const deleteRequestForm = async (req: Request, res:Response):Promise<Response> => {
    const { formid } = req.params

    await Recepient.findOneAndUpdate({ _id: formid }, { active: false })

    return res.json({ message: "Form deleted successfully", mstatus: 204 }).status(204)
}

const donorData = async (req: Request, res:Response):Promise<Response> => {

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

    return res.json(response)
}

module.exports = { searchDonorList, requestBlood, updateRequestBlood, deleteRequestForm, getFormRequest, donorData }