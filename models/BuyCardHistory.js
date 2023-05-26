const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BuyCardHistorySchema = new Schema({

    username: {type:String},
    provider: {type:String},
    cardCode: {type:String},
    money: {type:Number},
    amount: {type:Number},
    date:{type:String},
    fee: {type:Number,default: 0},
    status: {type:String,default:'success'},
})

module.exports = mongoose.model('BuyCardHistory', BuyCardHistorySchema)