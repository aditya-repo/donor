const redisServer = require("../config/redis");

const redisClient = redisServer(); // Ensure the client is connected

const newRedisData = async (phone, time ,otp) => {
    try {
        // Ensure the client is connected before performing any operations
        if (!redisClient.isReady) {
            console.log("Redis client is not ready yet.");
            return;
        }

        // Set the OTP value for the phone number
        await redisClient.setEx(phone, time, otp); // No callback needed here

        // Get the OTP value for the phone number
        const value = await redisClient.get(phone); // Await the promise to get the TTL

        return value
        // console.log(`The phone number: ${phone} with OTP: ${value}`);
    } catch (error) {
        console.log("Redis query error", error);
    }
};

const getRedisData = async(key)=>{
    const value = await redisClient.get(key)

    return value
}

module.exports = { newRedisData, getRedisData };
