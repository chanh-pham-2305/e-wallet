const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    phone:{ type:String, unique: true},
    email:{ type:String, unique: true},
    fullName:{ type:String},
    date:{ type:Date},
    address:{ type:String},
    front_photo:{type: String},
    back_photo:{type: String},
    password:{ type:String},
    balance:{ type:Number, default:0},
    isFirstLogin: {type: Boolean, default:'true'}
    })

module.exports = mongoose.model('User', User)