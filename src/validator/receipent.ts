// const Joi = require("joi")
import Joi from "joi"

import { phoneField, nameField, ageField, bloodGroupField, stateField, districtField, cityField, landmarkField, hospitalnameField, unitcountField } from "."

const askBloodDonationSchema = Joi.object({
    contactname: nameField,
    contactnumber: phoneField,
    patientname: nameField,
    patientcontact: phoneField,
    patientage: ageField,
    bloodGroup: bloodGroupField,
    unitcount: unitcountField,
    state: stateField,
    district: districtField,
    city: cityField,
    landmark: landmarkField,
    hospitalname: hospitalnameField
})

export {askBloodDonationSchema}