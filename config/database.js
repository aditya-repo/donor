const mongoose = require("mongoose")
require("dotenv").config()

const URI = process.env.MONGO_URI

const database = () =>{
    mongoose.connect(URI).then(()=> console.log("database connected")).catch(error=> console.log("Database connection error :", error))
}

module.exports = database