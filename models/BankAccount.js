const mongoose = require('mongoose')
const User = require('./User')
const Schema = mongoose.Schema

//bank account
const BankAccount = new Schema({
    cardNumber: { type:String, unique: true},
    accountNumber: { type:String, unique: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    expiredDate: { type:Date},
    money: {type: Number, default: 0},
})

module.exports = mongoose.model('BankAccount', BankAccount)