const redis = require('redis')
require("dotenv").config()

const REDIS_PORT = process.env.REDIS_PORT

const redisServer = () => {
    const client = redis.createClient({
        url: REDIS_PORT
    })

    client.connect()

    client.on('connect', ()=>{
        console.log("Redis server started");
        
    })
    client.on('error', (err)=>{
        console.log("Redis error: ", err);
    })

    return client
}

module.exports = redisServer