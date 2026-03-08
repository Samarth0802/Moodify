const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
    songUrl:{
        type:String,
        required:true,
    },
    posterUrl:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    mood:{
        type:String,
        enum:{
            values: ["sad","happy","suprised","neutral","angry"],
            message: `Not chose from`
        }
    }
},{
    timeStamps:true
})

const songModel = mongoose.model("Songs",songSchema)

module.exports = songModel