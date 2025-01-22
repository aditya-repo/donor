import redis from "redis"
import dotenv from "dotenv"
dotenv.config()

const REDIS_PORT = process.env.REDIS_PORT as string

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

export default redisServer