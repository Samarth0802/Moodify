const authModel = require("../models/auth.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


async function loginUser(req, res) {

    const { usernameorEmail, password } = req.body
    try {

        let user;

        if (usernameorEmail.includes("@")) {
            user = await authModel.findOne({ email: usernameorEmail })
        } else {
            user = await authModel.findOne({ username: usernameorEmail })
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
            user
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


module.exports = {loginUser,registerUser}