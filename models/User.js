const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    phone:{
        type:String,
        unique: true,
    },
    email:{
        type:String,
        unique: true,
    },
    fullname:{
        type:String,
    },
    date:{
        type:Date,
    },
    address:{
        type:String,
    },
    password:{
        type:String,
    },
    balance:{
        type:Number,
        default:0,
    },
    isFirstLogin:{
        type:Boolean,
        default:true,
    },

})

module.exports = mongoose.model('User', UserSchema)