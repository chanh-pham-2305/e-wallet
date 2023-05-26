const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DepositCardSchema = new Schema({

    cardCode: {type:String, unique: true},
    date: {type:String},
    CVV: {type:String, unique: true},

})

module.exports = mongoose.model('DepositCard', DepositCardSchema)