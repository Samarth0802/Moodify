const express = require('express')

const router = express.Router()
const upload = require('../middlewares/upload.middleware')
const { uploadSong, getSong } = require('../controllers/song.controller')


router.post('/',upload.single('song'),uploadSong)
router.get('/getSong',getSong)

module.exports = router
