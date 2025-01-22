// const mongoose = require("mongoose")
// require("dotenv").config()

import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const URI = process.env.MONGO_URI as string

const database = (): void =>{
    if (!URI) {
        console.error("Error: Mongo URI is not defined")
    }
    mongoose.connect(URI).then(()=> console.log("database connected")).catch(error=> console.log("Database connection error :", error))
}

export default database