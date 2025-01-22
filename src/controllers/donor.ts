import axios from "axios"
import User from "../models/users"
import { generateOtp } from "../util/generate"
import { getRedis, setExRedis } from "../util/redisCall"
import MedicalData from "../models/medical"
import { sendOtpSchema, verifyOtpSchema, newUserSchema, updateMedicalDataSchema } from "../validator/donor"
import Recepient from "../models/receipent"
import jwt from "jsonwebtoken"
require("dotenv").config()
import { Request, Response } from 'express'
import schemaError from "../util/joiError"

const JWT_TOKEN = process.env.JWT_TOKEN as string
const MESSAGE_URL = process.env.MESSAGE_URL as string
const MESSAGE_TOKEN = process.env.MESSAGE_TOKEN as string

const headers = {
    Authorization: MESSAGE_TOKEN,
    'Content-Type': 'application/json'
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const sendOtp = async (req: Request, res: Response): Promise<Response> => {

    const { phone } = req.body

    const { error } = sendOtpSchema.validate(req.body, { abortEarly: false })

    if (error) {
        const err = schemaError(error)
        return res.json(err)
    }

    const otp: string = (generateOtp(3)).toString()

    await setExRedis(phone, 120, otp)

    const payload = {
        payload: {
            services: ['message'],
            userid: {
                orderid: "KJ567",
                otp,
                number: phone,
                url: 'https://blooddonation.com/'
            }
        }
    }

    try {
        const response = await axios.post(MESSAGE_URL, payload, { headers });
        // return response
        if (response.status === 200) {
            return res.status(200).json({ message: "otp sent", mstatus: 200 })
        } else {
            return res.json({ message: "otp failed", mstatus: 500 })
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
}

const verifyOtp = async (req: Request, res: Response): Promise<Response> => {
    const { phone, otp } = req.body

    const { error } = verifyOtpSchema.validate(req.body)

    if (error) {
        const err = schemaError(error)
        return res.status(422).json({ message: err, mstatus: 422 })
    }

    const sentOtp = await getRedis(phone)
    if (sentOtp !== otp) {
        return res.status(401).json({ message: "OTP mismatch", mstatus: 401 })
    }

    const response = await User.findOne({ phone }).select('available')

    if (!response) {
        const newUserData = new User({ phone, available: false })
        await newUserData.save()
        return res.status(404).json({ message: "User not found", mstatus: 404, phone })
    }

    if (!response.available) {
        return res.status(200).json({ message: 'New User', mstatus: 251 })
    }

    const token = jwt.sign({ userid: response._id }, JWT_TOKEN, { expiresIn: '5h' })

    return res.status(200).json({ message: "User found", mstatus: 200, token })

}

const newUser = async (req: Request, res: Response): Promise<Response> => {
    const { name, dob, gender, city, bloodGroup } = req.body
    const { userid } = req.params

    const { error } = newUserSchema.validate(req.body)


    if (error) {
        const err = schemaError(error)
        return res.status(422).json(err)
    }

    const payload = { name, dob, gender, city }

    try {
        const response1 = await User.findOneAndUpdate({ _id: userid }, payload, { new: true })

        if (!response1) {
            return res.status(404).json({ message: "User not found", mstatus: 404 });
        }

        const response2 = new MedicalData({ userid: response1._id, bloodGroup })
        await response2.save()
        const token = jwt.sign({ userid: response1._id }, JWT_TOKEN, { expiresIn: '5h' })
        return res.status(201).json({ message: "New user created", mstatus: 201, token })

    } catch (error: any) {

        return res.status(500).json({ message: "Error creating user", error: error.message });

    }
}

const profileUpdate = async (req: Request, res: Response): Promise<Response> => {
    const { name, age, gender, phone, city, bloodGroup } = req.body
    const { userid } = req.user

    const { error } = newUserSchema.validate({ name, age, gender, phone, city, bloodGroup })

    if (error) {
        const err = schemaError(error)
        return res.status(422).json(err)
    }

    const payload = { name, age, gender, phone, city }
    const response = await User.findOneAndUpdate({ _id: userid }, payload, { new: true })

    return res.status(201).json({ message: response, mstatus: 201 })
}

const getProfile = async (req: Request, res: Response): Promise<Response> => {
    const { userid } = req.user
    const response = await User.findById({ _id: userid })

    return res.status(200).json({ message: "profile found", data: response, mstatus: 200 })
}

const deleteProfile = async (req: Request, res: Response): Promise<Response> => {
    const { userid } = req.user
    await User.findByIdAndDelete({ _id: userid })
    return res.status(204).json({ message: "User deleted successfully", mstatus: 204 })
}

const toggleActive = async (req: Request, res: Response): Promise<Response> => {
    const { userid } = req.user

    const status = await User.findById({ _id: userid }).select('active')

    if (!status) {
        
        return res.status(201).json({ message: "Not found" });
    }

    const response = await User.findOneAndUpdate({ _id: userid }, { active: (!status.active) }, { new: true })

    return res.status(201).json({ message: response, mstatus: 201 })
}

const toggleVisiblity = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userid } = req.user;

        const status = await User.findById({ _id: userid }).select('visible');

        if (!status) {
            return res.status(201).json({ message: "Not found" });
        }

        const response = await User.findOneAndUpdate({ _id: userid }, { active: !status.visible }, { new: true });

        return res.status(201).json({ message: response, mstatus: 201 });
    } catch (error: any) {
        return res.status(500).json({ message: "Error toggling visibility", error: error.message });
    }
};

const updateMedicalData = async (req: Request, res: Response): Promise<Response> => {
    const { bloodGroup, diabetic, allergies, diseases, tobacco, alcohol } = req.body
    const { userid } = req.user

    const { error } = updateMedicalDataSchema.validate(req.body)

    if (error) {
        const err = schemaError(error)
        return res.status(422).json(err)
    }

    const response = await MedicalData.findOne({ userid }, { bloodGroup, diabetic, allergies, diseases, tobacco, alcohol }, { new: true })
    return res.status(201).json({ message: response, mstatus: 201 })
}

const bloodRecepientList = async (req: Request, res: Response): Promise<Response> => {
    const { userid } = req.user
    const currentDate = new Date()
    const checkBloodGroup = await MedicalData.findOne({ userid }).select('bloodGroup state district location -_id')
    if (!checkBloodGroup) {
        return res.status(404).json({ message: "Not found" });
    }
    const response = await Recepient.find({ bloodGroup: checkBloodGroup.bloodGroup, requirementdate: { $gte: currentDate } }).select('contactname contactnumber unitcount state district city landmark hospitalname bloodGroup bloodType')
    return res.status(200).json(response)
}

export { sendOtp, verifyOtp, newUser, profileUpdate, getProfile, deleteProfile, toggleActive, updateMedicalData, toggleVisiblity, bloodRecepientList }