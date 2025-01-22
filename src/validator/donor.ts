import Joi from "joi";
import {
    phoneField,
    otpField,
    nameField,
    ageField as dobField,
    genderField,
    cityField,
    bloodGroupField,
    alcoholField,
    tobaccoField,
    bloodTypeField,
} from ".";

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


export {
    sendOtpSchema,
    verifyOtpSchema,
    newUserSchema,
    updateMedicalDataSchema,
}
