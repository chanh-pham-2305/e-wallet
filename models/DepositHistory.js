const mongoose = require('mongoose')

const DepositHistorySchema = new mongoose.Schema({
    userID: {type:String},
    depositMoney: {type:Number},
    date:{type:String, default: new Date()},
    status: {type:String,default:'success'},

})

module.exports = mongoose.model('DepositHistory', DepositHistorySchema)