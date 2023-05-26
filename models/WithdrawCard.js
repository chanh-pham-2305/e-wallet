const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WithdrawCardSchema = new Schema({

    cardCode: {type:String},
    date:{type:String},
    CVV: {type:String},
    money: {type:Number}
})

module.exports = mongoose.model('WithdrawCard', WithdrawCardSchema)