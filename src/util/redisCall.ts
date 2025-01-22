import redisServer from "../config/redis";

const client = redisServer()

const checkStatus = (): void => {
    try {
        if (!client.isReady) {
            console.log("Redis client is not ready yet!");
        }
    } catch (error) {
        console.log("Error checking Redis client status", error);
    }
}

const setExRedis = async (key: string, ttl: number, value: string): Promise<void> => {

    checkStatus()

    try {
        await client.setEx(key, ttl, value)
    } catch (error) {
        console.log("Redis saving error", error);
    }
}

const getRedis = async (key:string): Promise<string | null> => {

    checkStatus()

    try {
        const value = await client.get(key)
        return value
    } catch (error) {
        console.log("redis getting data error", error);
        return null
    }
}

export { setExRedis, getRedis }