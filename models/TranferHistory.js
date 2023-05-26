const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TranferHistorySchema = new Schema({

    cardCode: {type:String, unique: true},
    date: {type:Date},
    CVV: {type:String, unique: true},

})

module.exports = mongoose.model('TranferHistory', TranferHistorySchema)