const { date } = require('joi')
const mongoose = require('mongoose')

const WithdrawHistorySchema = new mongoose.Schema({

    userID: {type:String},
    withdrawMoney: {type:Number},
    fee:{type:Number,default:0},
    date: {type:Date, default: new Date()},
    status: {type:String,default:'success'},

})

module.exports = mongoose.model('WithdrawHistory', WithdrawHistorySchema)