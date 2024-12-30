const Joi = require("joi");

const phoneField = Joi.string().trim().length(10).pattern(/^\d+$/).required().messages({
    "string.base": "Phone number must be a string",
    "string.length": "Phone number must be exactly 10 digits",
    "string.pattern.base": "Phone number must contain only digits",
    "any.required": "Phone number is required",
});

const otpField = Joi.string().trim().length(3).pattern(/^\d+$/).required().messages({
    "string.base": "OTP must be a string",
    "string.length": "OTP must be exactly 3 digits",
    "string.pattern.base": "OTP must contain only digits",
    "any.required": "OTP is required",
});

const nameField = Joi.string().trim().min(3).max(40).alphanum().required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name should be at least 3 characters",
    "string.max": "Name should not exceed 40 characters",
    "any.required": "Name is required",
    "string.alphanumeric": "Name should only be alphanumeric only"
});

const genderField = Joi.string().trim().alphanum().required().valid('male', 'female', 'others').messages({
    "string.base": "Gender must be a string",
    "string.valid": "Gender is invalid",
    "any.required": "Gender is required",
    "string.alphanumeric": "Gender should only be alphanumeric only"
})

const cityField = Joi.string().trim().messages({
    "string.base": "City must be string",
})

const bloodGroupField = Joi.string().trim().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required().messages({
    "string.base": "Blood type should be string",
    "string.valid": "Blood type is invalid",
    "any.required": "Blood type is required"
})

const ageField = Joi.string().required().messages({
    "date.base": "Date of birth must be a valid date",
});

const tobaccoField = Joi.boolean().messages({
    "boolean.base": "Tobacco field must be a boolean value (true or false)",
    "any.required": "Tobacco field is required",
});

const diabeticField = Joi.boolean().messages({
    "boolean.base": "Diabetic field must be a Yes or No only",
});

const alcoholField = Joi.boolean().messages({
    "boolean.base": "Alcohol field must be a Yes or No only",
});

const bloodTypeField = Joi.string().valid('PCV', 'Whole Blood', 'Platelets', 'Plasma', 'R.B.C', 'S.D.P (Single Donor Platlets', 'Others').required().messages({
    "any.only": "Blood type must be one of PCV, Whole Blood, Platelets, Plasma, R.B.C, S.D.P (Single Donor Platlets, Others",
    "any.required": "Blood type is required"
});

const unitcountField = Joi.number().integer().positive().required().messages({
    "number.base": "Unit count must be a positive number",
    "any.required": "Unit count is required"
});

const statusField = Joi.string().valid('Rush', 'Urgent', 'Planned', 'Other').required().messages({
    "any.only": "Status must be one of Rush, Urgent, Planned, Other",
    "any.required": "Status is required"
});

const requestnoteField = Joi.string().trim().max(500).messages({
    "string.max": "Request note cannot exceed 500 characters"
});

const stateField = Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "State must be a string",
    "string.min": "State must be at least 2 characters long",
    "string.max": "State cannot exceed 50 characters",
    "any.required": "State is required"
});

const districtField = Joi.string().trim().min(2).max(50).required().messages({
    "string.base": "District must be a string",
    "string.min": "District must be at least 2 characters long",
    "string.max": "District cannot exceed 50 characters",
    "any.required": "District is required"
});


const landmarkField = Joi.string().trim().min(2).max(100);

const hospitalnameField = Joi.string().trim().min(2).max(100).required().messages({
    "string.base": "Hospital name must be a string",
    "string.min": "Hospital name must be at least 2 characters long",
    "string.max": "Hospital name cannot exceed 100 characters",
    "any.required": "Hospital name is required"
});


module.exports = { phoneField, otpField, nameField, cityField, bloodGroupField, ageField, genderField, tobaccoField, alcoholField, diabeticField
    , bloodTypeField, unitcountField, statusField, requestnoteField, stateField, districtField, landmarkField, hospitalnameField
 }