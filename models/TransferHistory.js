const mongoose = require('mongoose')

const TransferHistorySchema = new mongoose.Schema({
    remitterID: {type: String},
    payeeID: {type: String},
    money: {type: Number},
    content: {type: String},
    fee: {type: Number, default: 0},
    date: {type:Date},
    })

module.exports = mongoose.model('TransferHistory', TransferHistorySchema)