const express = require('express')
const { loginUser, registerUser,getLoggedInUser,logoutUser } = require('../controllers/auth.controller')
const { authMiddleware } = require('../middlewares/auth.middleware')
const router = express.Router()


router.post('/login',loginUser)
router.post('/register',registerUser)
router.get('/get-me',authMiddleware,getLoggedInUser)

router.post('/logout',logoutUser)

module.exports = router