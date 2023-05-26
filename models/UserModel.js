const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({

    phone: {type:String, unique: true},
    email: {type:String, unique: true},
    fullname: {type:String},
    date: {type:String},
    address: {type:String},
    username: {type:String},
    hashedPassword: {type:String},
    front_photo: {type:String,default:''},
    back_photo: {type:String,default:''},
    balance: {type:Number,default:0},
    status: {type:String,default: 'wait_verification'},
    loginAbnormal: {type:Number,default:0},
    isFirstLogin: {type:Boolean,default:true},

})

module.exports = mongoose.model('User', UserSchema)