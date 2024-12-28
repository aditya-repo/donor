const redisServer = require("../config/redis");

const client = redisServer()

const checkStatus = () => {
    try {

        if (!client.isReady) {
            console.log("Redis client is not ready yet!");
            return false
        }
    } catch (error) {

        console.log("Error checking Redis client status", error);
        return false;  // Return false in case of any errors
    }
}

const setExRedis = async (key, ttl, value) => {

    checkStatus()

    try {
        await client.setEx(key, ttl, value)
    } catch (error) {
        console.log("Redis saving error", error);
    }
}

const getRedis = async (key) => {

    checkStatus()

    try {
        const value = await client.get(key)
        return value
    } catch (error) {
        console.log("redis getting data error", error);

    }
}

module.exports = { setExRedis, getRedis }