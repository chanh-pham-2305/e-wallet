const mongoose = require('mongoose')
const Schema = mongoose.Schema
const BuyCardHistorySchema = new Schema({
    author: {type:Schema.Types.ObjectId, ref: 'User'},
    provider: {type:String,default: ['11111','22222','33333']},
    cardCode: {type:String},
    cardValue: {type:Number, default: [10000,20000,50000,100000,200000,500000]},
    amount: {type:Number},
    date:{type:Date},
    fee: {type:Number, default: 0},
    status: {type:String, default:'success'},
    })

module.exports = mongoose.model('BuyCardHistory', BuyCardHistorySchema)