const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WithdrawHistorySchema = new Schema({

    username: {type:String},
    cardCode:{type:String},
    money: {type:Number},
    fee:{type:Number,default:5},
    note: {type:String},
    date: {type:String},
    day:{type: Number,default:0},
    status: {type:String,default:'success'},

})

module.exports = mongoose.model('WithdrawHistory', WithdrawHistorySchema)