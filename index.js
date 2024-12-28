const express = require("express")
const path = require("path")
const http = require("http")
const WebSocket = require("ws")
const cors = require("cors")
const database = require("./config/database")
// const corsConfig = require("./config/cors")
const redisServer = require("./config/redis")
const setupSocket = require("./config/websocket")
require("dotenv").config()

const app = express()

const server = http.createServer(app)

const wss = new WebSocket.Server({server})

const connections = new Map()

setupSocket(wss, connections)

const PORT = process.env.PORT || 4000
// const NODE_ENV = process.env.NODE_ENV || 'prod'

database()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/', express.static(path.join(__dirname, 'public')))


// Routes


app.listen(PORT, ()=>{
    console.log(`SERVER started on PORT : ${PORT}`);
})