
//models
const User = require('../models/User');
const BankAccount = require('../models/BankAccount');
const BuyCardHistory = require('../models/BuyCardHistory');
const TransferHistory = require('../models/TransferHistory');
const DepositHistory = require('../models/DepositHistory');
const WithdrawHistory = require('../models/WithdrawHistory');

//validators
const buyCardValidator = require("../routers/validators/buyCardValidator");
const transferValidator = require("../routers/validators/transferValidator");
const transactionValidator = require("../routers/validators/transactionValidator");


class WalletController {
  async buyCard (req,res){

    let {error} = buyCardValidator(req.body);
    if (error) return res
                      .status(402)
                      .send(error.details[0].message)

    let ProviderList = {
        11111: "viettel",
        22222: "mobifone",
        33333: "vinaphone",
    }
    let CardCodeList = []
    let { provider,
        cardValue,
        amount} = req.body

    let {_id,
        phone,
        email,
        balance,
        } = req.user

    //convert sting to int
    cardValue = +cardValue
    amount = +amount

    const rest = balance - cardValue*amount
    // console.log(ProviderList[provider]);
    if(rest < 0) return res
                        .status(401)
                        .json({msg: "The account does not have enough money, please top up",
                               user: {phone, email, balance},
                               card: {provider: ProviderList[provider],
                                    cardValue,
                                    amount }  })

    //create cardCode random
    while(CardCodeList.length != amount){

        const cardCode = provider + Math.random().toString().slice(2,7)
        CardCodeList.push(cardCode)
    }

    var date =new Date();
    const buyCardHistory = await BuyCardHistory.create({userID: _id,
                                                        provider: provider,
                                                        cardCode: CardCodeList,
                                                        cardValue: cardValue,
                                                        amount: amount,
                                                        date: date})

    const updatedUser = await User.findByIdAndUpdate(_id,
                                                    {balance: rest},
                                                    {new: true})

    return res
            .status(201)
            .json({msg: 'buy card successfully',
                cards: buyCardHistory,
                user: updatedUser})
  }

  async transfer (req, res) {
    const {error} = transferValidator(req.body)
    if(error) return res
                      .status(401)
                      .send(error.details[0].message)

    //payeePhone = phone model
    let { payeePhone,
          money,
          content} = req.body

    let {_id,
      balance} = req.user

    const payeeUser = await User.findOne({phone: payeePhone})

    if(!payeeUser) return res
                            .status(401)
                            .json({msg: 'Invalid phone number'})

    if(balance - money < 0) return res
                                    .status(401)
                                    .json({msg: 'Your balance is not enough, please refill and try again'})

    let newRemitterUserBalance = balance - money
    let newPayeeUserBalance = payeeUser.balance + money

    const updatedRemitterUser = await User.findByIdAndUpdate(_id,
                                                          {balance: newRemitterUserBalance},
                                                          {new: true})

    const updatedPayeeUser = await User.findByIdAndUpdate({_id: payeeUser._id},
                                                          {balance: newPayeeUserBalance},
                                                          {new: true})

    const newTransfer = await TransferHistory.create({remitterID: _id,
                                                      payeeID: payeeUser._id,
                                                      money: money,
                                                      content: content,
                                                      date: Date.now()})

    return res
            .status(201)
            .json({msg: 'transfer successfully',
                  remitterUser: updatedRemitterUser,
                  payeeUser:updatedPayeeUser,
                  transaction: newTransfer})
  }

  async deposit (req, res){

    const {error } = transactionValidator(req.body)
    if(error) return res.status(401).send(error.details[0].message)

    let userID = req.user._id
    let depositMoney = +money

    const bankAccount = await BankAccount.findOne({userConnectionID:userID})
    let newMoneyBankAccount = bankAccount.money - depositMoney
    if(newMoneyBankAccount < 50000 ) return res
                                            .status({msg: 'Money in bank account is not enough, please top up and try again'})
    //update BankAccount
    const updatedBankAccount = await BankAccount.findByIdAndUpdate(bankAccount._id,
                                                                    {money: newMoneyBankAccount},
                                                                    {new: true})
    //update User
    let user = await User.findOne({_id: userID})
    let newMoneyUser = user.balance + depositMoney
    const updatedUser = await User.findByIdAndUpdate(user._id,
                                                    {balance: newMoneyUser},
                                                    {new: true})
    //update DepositHistory
    const newDepositHistory = await DepositHistory.create({ userID,
                                                            depositMoney })

    return res
            .status(201)
            .json({msg: 'transaction successfully',
                  updatedBankAccount: updatedBankAccount,
                  updatedUser: updatedUser,
                  newDepositHistory: newDepositHistory})
  }

  async withdraw(req, res) {
    const {error } = transactionValidator(req.body)
    if(error) return res.status(401).send(error.details[0].message)

    let userID = req.user._id
    let withdrawMoney = +money


    let user = await User.findOne({_id: userID})
    let newMoneyUser = user.balance - withdrawMoney
    if(newMoneyUser < 0 ) return res
    .status({msg: 'Money in wallet is not enough, please top up and try again'})
    //update User
    const updatedUser = await User.findByIdAndUpdate(user._id,
                                                    {balance: newMoneyUser},
                                                    {new: true})
    //update BankAccount
    const bankAccount = await BankAccount.findOne({userConnectionID:userID})
    let newMoneyBankAccount = bankAccount.money + withdrawMoney
    const updatedBankAccount = await BankAccount.findByIdAndUpdate(bankAccount._id,
                                                                    {money: newMoneyBankAccount},
                                                                    {new: true})
    //update DepositHistory
    const newWithdrawHistory = await WithdrawHistory.create({ userID,
                                                            WithdrawMoney })

    return res
            .status(201)
            .json({msg: 'transaction successfully',
                  updatedBankAccount: updatedBankAccount,
                  updatedUser: updatedUser,
                  newWithdrawHistory: newWithdrawHistory})
  }
}

  module.exports = new WalletController();
