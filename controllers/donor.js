const { default: axios } = require("axios")
const jwt = require("jsonwebtoken")
const User = require("../models/users")
const { generateOtp } = require("../util/generate")
const { getRedis, setExRedis } = require("../util/redisCall")
const MedicalData = require("../models/medical")
const { sendOtpSchema, verifyOtpSchema, newUserSchema } = require("../validator/donor")
const schemaError = require("../util/joiError")
const Recepient = require("../models/receipent")
require("dotenv").config()

const JWT_TOKEN = process.env.JWT_TOKEN
const MESSAGE_URL = process.env.MESSAGE_URL
const MESSAGE_TOKEN = process.env.MESSAGE_TOKEN

const headers = {
    Authorization: MESSAGE_TOKEN,
    'Content-Type': 'application/json'
}

const sendOtp = async (req, res) => {

    const { phone } = req.body

    // const phone = 7050020659

    const { error } = sendOtpSchema.validate(req.body, { abortEarly: false })

    if (error) {
        const err = schemaError(error)
        return res.json(err)
    }

    const otp = generateOtp(3)

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
    } catch (error) {
        return res.status(500).json({ message: "Error sending OTP", error: error.message });
    }


    if (response.status === 200) {
        return res.status(200).json({ message: "otp sent", mstatus: 200 })
    } else {
        return res.json({ message: "otp failed", mstatus: 500 })
    }
}

const verifyOtp = async (req, res) => {
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

    res.status(200).json({ message: "User found", mstatus: 200, token })

}

const newUser = async (req, res) => {
    const { name, dob, gender, city, bloodGroup } = req.body
    const { userid } = req.params

    const { error } = newUserSchema.validate(req.body)

    if (error) {
        const err = schemaError(error)
        return res.status(422).json(err)
    }

    const payload = { name, dob, gender, city }

    const response1 = await User.findOneAndUpdate({ _id: userid }, payload, { new: true })
    const response2 = new MedicalData({ userid: response1._id, bloodGroup })
    await response2.save()
    const token = jwt.sign({ userid: response1._id }, JWT_TOKEN, { expiresIn: '5h' })

    res.status(201).json({ message: "New user created", mstatus: 201, token })
}

const profileUpdate = async (req, res) => {
    const { name, age, gender, phone, city, bloodGroup } = req.body
    const { userid } = req.user

    const { error } = newUser.validate(name, age, gender, phone, city, bloodGroup)

    if (error) {
        return res.status(422).json(error)
    }

    const payload = { name, age, gender, phone, city }
    const response = await User.findOneAndUpdate({ _id: userid }, payload, { new: true })

    res.status(201).json({ message: response, mstatus: 201 })
}

const getProfile = async (req, res) => {
    const { userid } = req.user
    const response = await User.findById({ _id: userid })

    res.status(200).json({ message: "profile found", data: response, mstatus: 200 })
}

const deleteProfile = async (req, res) => {
    const { userid } = req.user
    await User.findByIdAndDelete({ _id: userid })
    res.status(204).json({ message: "User deleted successfully", mstatus: 204 })
}

const toggleActive = async (req, res) => {
    const { userid } = req.user

    const status = await User.findById({ _id: userid }).select('active')

    const response = await User.findOneAndUpdate({ _id: userid }, { active: (!status.active) }, { new: true })

    res.status(201).json({ message: response, mstatus: 201 })
}

const toggleVisiblity = async (req, res) => {
    const { userid } = req.user

    const status = await User.findById({ _id: userid }).select('visible')

    const response = await User.findOneAndUpdate({ _id: userid }, { active: (!status.visible) }, { new: true })

    res.status(201).json({ message: response, mstatus: 201 })
}

const updateMedicalData = async (req, res) => {
    const { bloodGroup, diabetic, allergies, diseases, tobacco, alcohol } = req.body
    const { userid } = req.user

    const { error } = updateMedicalData.validate(req.body)

    if (error) {
        return res.status(422).json(error)
    }

    const response = await MedicalData.findOne({ userid }, { bloodGroup, diabetic, allergies, diseases, tobacco, alcohol }, { new: true })
    res.status(201).json({ message: response, mstatus: 201 })
}

const bloodRecepientList = async (req, res) => {
    const { userid } = req.user
    const currentDate = new Date()
    const checkBloodGroup = await MedicalData.findOne({ userid }).select('bloodGroup state district location -_id')
    const response = await Recepient.find({ bloodGroup: checkBloodGroup.bloodGroup, requirementdate: { $gte: currentDate } }).select('contactname contactnumber unitcount state district city landmark hospitalname bloodGroup bloodType')
    res.status(200).json(response)
}

module.exports = { sendOtp, verifyOtp, newUser, profileUpdate, getProfile, deleteProfile, toggleActive, updateMedicalData, toggleVisiblity, bloodRecepientList }