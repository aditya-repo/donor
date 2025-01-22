import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const JWT_TOKEN = process.env.JWT_TOKEN as string

declare global {
    namespace Express {
        interface Response {
            user?: any
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({message: "Unauthorized access", mstatus: 401})
    }

    try {
        const decode = jwt.verify(token, JWT_TOKEN)
        res.user = decode
        next()
    } catch (error) {
        return res.status(403).json({message: `Authentication failed: ${error}`, mstatus: 403})
    }
}

export default authMiddleware