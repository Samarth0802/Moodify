const songModel = require('../models/song.model')
const NodeID3 = require('node-id3')
const uploadFile = require('../services/upload.service')

async function uploadSong(req,res){

    try{

        const songBuffer = req.file.buffer
        const { mood } = req.body

        const tags = NodeID3.read(songBuffer)

        const title  = tags.title  || req.file.originalname
        const artist = tags.artist || "Unknown"
        const album  = tags.album  || "Unknown"

        const imageBuffer = tags.image?.imageBuffer

        const uploads = []

        // song upload promise
        uploads.push(
            uploadFile(
                songBuffer,
                "song_" + Date.now(),
                "/songs/audio"
            )
        )

        // image upload promise
        if(imageBuffer){
            uploads.push(
                uploadFile(
                    imageBuffer,
                    "cover_" + Date.now(),
                    "/songs/cover"
                )
            )
        }

        const [songFile, imageFile] = await Promise.all(uploads)

        const songDetails = await songModel.create({
            songUrl : songFile.url,
            posterUrl : imageFile?.url || "",
            title,
            artist,
            album,
            mood
        })

        res.status(201).json({
            message:"Song Uploaded Successfully",
            song:songDetails
        })

    }catch(error){

        res.status(500).json({
            message:"Song upload failed",
            error:error.message
        })

    }

}

async function getSong(req,res){

    try{

        const { mood } = req.query

        const song = await songModel.find({ mood })

        if(!song){
            return res.status(404).json({
                message:"No song found for this mood"
            })
        }

        res.status(200).json({
            song
        })

    }
    catch(error){

        res.status(500).json({
            message:"Server error",
            error:error.message
        })

    }

}

module.exports = {uploadSong,getSong}