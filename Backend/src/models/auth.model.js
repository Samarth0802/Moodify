const mongoose = require('mongoose')

const authUser = new mongoose.Schema(
{
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
},
{
    timestamps:true
})

const authModel = mongoose.model("Auth", authUser)

module.exports = authModel