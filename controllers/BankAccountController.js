
//models
const BankAccount = require('../models/BankAccount')

//validator
const transactionValidator = require("../routers/validators/transactionValidator");


class BankAccountController{
    async createAccount (req,res){
        let userConnectionID = req.user._id
        const checkAccount = BankAccount.findOne(userConnectionID)

        if(checkAccount) return res
                                .status(401)
                                .json({msg:'User had bank account.'})

        const cardNumber = Math.random().toString().slice(2,13)
        const accountNumber = Math.random().toString().slice(2,17)
        const today = new Date()
        //expiredDate = today + 5 years
        const expiredDate = new Date(today.getFullYear()+ 5,today.getMonth(),today.getDay())

        const newAccount = BankAccount.create({ cardNumber,
                                                accountNumber,
                                                userConnectionID,
                                                expiredDate })

        return res
                .status(201)
                .json({msg: 'create bank account connection successfully',
                        BankAccount: newAccount})
    }

    async updateMoneyBankAccount (req,res){

        const {error } = transactionValidator(req.body)
        if(error) return res.status(401).send(error.details[0].message)

        let { _id } = req.user
        let { money } = req.body

        const BankAccountConnection = await BankAccount.findOne({userConnectionID:_id})

        let newMoney = BankAccountConnection.money + money

        const updatedBankAccount = await BankAccount.findByIdAndUpdate(BankAccountConnection._id,
                                                                {money:newMoney},
                                                                {new: true} )

        return res.status(201).json({msg: 'updated successfully',
                                    updatedBankAccount})
    }
}

module.exports = new BankAccountController()