// const { searchDonorList } = require("./controllers/receipent")


import express, { Application } from "express"
import path from  "path"
// import http from "http"
// import WebSocket from "ws"
import cors from "cors"
import database from "./config/database"
import redisServer from './config/redis'
import dotenv from "dotenv"
dotenv.config()

// import {searchdon}


const app: Application = express()

// const server = http.createServer(app)

// const connections = new Map()

const PORT = process.env.PORT as string || 4000

database()

// // Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(path.join(__dirname, 'public')))

// app.post('/', searchDonorList)
// // Routes


app.listen(PORT, ()=>{
    console.log(`SERVER started on PORT : ${PORT}`);
})