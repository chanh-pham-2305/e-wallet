const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DepositHistorySchema = new Schema({

    username: {type:String},
    cardCode: {type:String},
    CVV: {type:String},
    money: {type:Number},
    date:{type:String},
    status: {type:String,default:'success'},

})

module.exports = mongoose.model('DepositHistory', DepositHistorySchema)