const { default: axios } = require("axios")
const jwt = require("jsonwebtoken")
const User = require("../models/users")
const { generateOtp } = require("../util/generate")
const { getRedis, setExRedis } = require("../util/redisCall")
const MedicalData = require("../models/medical")
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

    const sentOtp = await getRedis(phone)
    if (sentOtp !== otp) {
        return res.status(401).json({ message: "OTP mismatch", mstatus: 401 })
    }

    const response = await User.findOne({ phone }).select('available')

    if (!response) {
        return res.status(404).json({ message: "User not found", mstatus: 404 })
    }

    if (!response.available) {
        return res.status(200).json({ message: 'New User', mstatus: 251 })
    }

    const token = jwt.sign({ userid: response._id }, JWT_TOKEN, { expiresIn: '5h' })

    res.status(200).json({ message: "User found", mstatus: 200, token })

}

const newUser = async (req, res) => {
    const { name, dob, gender, city, bloodType } = req.body
    const { userid } = req.params

    const payload = { name, dob, gender, city, bloodType }

    const response = await User.findOneAndUpdate({ _id: userid }, payload, { new: true })
    const token = jwt.sign({ userid: response._id }, JWT_TOKEN, { expiresIn: '5h' })

    res.status(201).json({ message: "New user created", mstatus: 201, token })
}

const profileUpdate = async (req, res) => {
    const { name, age, gender, phone, city, bloodType } = req.body
    const { userid } = req.user

    const payload = { name, age, gender, phone, city, bloodType }
    const response = await User.findOneAndUpdate({ _id: userid }, payload, {new: true})

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

    res.status(201).json({message: response, mstatus: 201})
}

const updateMedicalData = async (req, res) =>{
    const {bloodType, diabetic, allergies, diseases, tobacco, alcohol} = req.body
    const {userid} = req.user

    const response = await MedicalData.findOne({userid}, {bloodType, diabetic, allergies, diseases, tobacco, alcohol}, {new: true})
    res.status(201).json({message: response, mstatus: 201})
}

module.exports = { sendOtp, verifyOtp, newUser, profileUpdate, getProfile, deleteProfile, toggleActive, updateMedicalData }