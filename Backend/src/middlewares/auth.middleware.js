const jwt = require('jsonwebtoken');
const authModel = require('../models/auth.model');
const tokenModel = require('../models/blacklist.model');
const redis = require('../config/cache')

async function authMiddleware(req, res, next) {

    const token = req.cookies.token;
    //console.log(token)

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const isTokenBlackListed = await redis.get(token)
    // console.log(isTokenBlackListed)

    if(isTokenBlackListed){
        return res.status(401).json({
            "message":"User unauthorized"
        })
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    

        req.user = decoded
        next()

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }
}

module.exports = { authMiddleware }