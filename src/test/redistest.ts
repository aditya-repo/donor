const redisServer = require("../config/redis");

const redisClient = redisServer(); 

const newRedisData = async (phone: string, time: number ,otp: string) => {
    try {
        if (!redisClient.isReady) {
            console.log("Redis client is not ready yet.");
            return;
        }

        await redisClient.setEx(phone, time, otp);

        const value = await redisClient.get(phone);

        return value
        
    } catch (error) {
        console.log("Redis query error", error);
        return false
    }
};

const getRedisData = async(key: string)=>{
    const value = await redisClient.get(key)
    return value
}

export { newRedisData, getRedisData }