const jwt = require("jsonwebtoken")
require("dotenv").config()
const JWT_TOKEN = process.env.JWT_TOKEN

const authMiddleware = (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(401).json({message: "Unauthorized access", mstatus: 401})
    }
    try {
        const decode = jwt.verify(token, JWT_TOKEN)
        req.user = decode
        next()
    } catch (error) {
        return res.status(403).json({message: `Authentication failed: ${error}`, mstatus: 403})
    }
}