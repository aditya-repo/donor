const Joi = require("joi");
const { phoneField, otpField, nameField, dobField, genderField, cityField, bloodGroupField, alcoholField, tobaccoField } = require(".");

const sendOtpSchema = Joi.object({
    phone: phoneField,
});

const verifyOtpSchema = Joi.object({
    phone: phoneField,
    otp: otpField,
});

const newUserSchema = Joi.object({
    name: nameField,
    dob: dobField,
    gender: genderField,
    city: cityField,
    bloodGroup: bloodGroupField
})

const updateMedicalDataSchema = Joi.object({
    bloodType: bloodTypeField,
    alcohol: alcoholField,
    tobacco: tobaccoField
})

module.exports = { sendOtpSchema, verifyOtpSchema, newUserSchema, updateMedicalDataSchema };
