const authModel = require("../models/auth.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/blacklist.model");
const redis = require('../config/cache')

async function loginUser(req, res) {

    const { usernameorEmail, password } = req.body
    try {

        let user;

        if (usernameorEmail.includes("@")) {
            user = await authModel.findOne({ email: usernameorEmail }).select("+password")
        } else {
            user = await authModel.findOne({ username: usernameorEmail }).select("+password")
        }

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)

        return res.status(200).json({
            message: "Login successful",
            user:{
                usermame:user.username,
                email:user.email,
                id:user._id
            }
        })

    } catch (error) {

        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

async function registerUser(req, res) {
    const { username, email, password } = req.body

    try {

        const existingUser = await authModel.findOne({
            $or: [{ username }, { email }]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new authModel({
            username,
            email,
            password: hashedPassword
        })

        await newUser.save()

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

async function getLoggedInUser(req, res) {
    try {

        const userId = req.user.id
        const user = await authModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        //console.log(user)

        return res.status(200).json({
            user:{
                username:user.username,
                email:user.email,
                id:user._id
            }
        })

    } catch (error) {

        return res.status(500).json({
            message: "Server error",
            error: error.message
        })

    }
}

async function logoutUser(req,res){
    const token = req.cookies.token
    res.clearCookie("token")
    
    await redis.set(token,Date.now().toString())


    res.status(200).json({
        message:"Logged Out Successfully"
    })
}

module.exports = {loginUser,registerUser,getLoggedInUser,logoutUser}