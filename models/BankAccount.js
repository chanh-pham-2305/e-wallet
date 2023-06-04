const mongoose = require('mongoose')

//bank account
const BankAccountSchema = new mongoose.Schema({

    cardNumber: {
                type:String,
                unique: true },
    accountNumber: {type:String,
                    unique: true },
    userConnectionID: {type: String},
    expiredDate: {type:String },
    money: {type: Number,
            default: 0 },

})

module.exports = mongoose.model('BankAccount', BankAccountSchema)