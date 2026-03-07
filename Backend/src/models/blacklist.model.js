const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token not found"]
    }
},{
    timestamps:true
})

const tokenModel = mongoose.model("BlackList_Token",tokenSchema)

module.exports = tokenModel