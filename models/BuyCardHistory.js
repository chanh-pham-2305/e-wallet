const mongoose = require('mongoose')

const BuyCardHistorySchema = new mongoose.Schema({
    userID: {type:String},
    provider: {type:String,default: ['11111','22222','33333']},
    cardCode: {type:Object},
    cardValue: {type:Number, default: [10000,20000,50000,100000]},
    amount: {type:Number},
    date:{type:Date},
    fee: {type:Number,default: 0},
    status: {type:String,default:'success'},
})

module.exports = mongoose.model('BuyCardHistory', BuyCardHistorySchema)