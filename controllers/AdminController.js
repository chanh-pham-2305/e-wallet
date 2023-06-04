//models
const User = require('../models/User')
const BuyCardHistory = require('../models/BuyCardHistory');
const TransferHistory = require('../models/TransferHistory');
const DepositHistory = require('../models/DepositHistory');
const WithdrawHistory = require('../models/WithdrawHistory');

class AdminController {
    index(req, res) {
      return res.status(201).send('home admin page');
    }

    async getUser (req,res) {

      const _id = req.params.id
      const user = User.findById(_id)

      return res
              .status(201)
              .json({user: user})
    }

    async getAllUsers (req,res) {

      const users = User.find()

      return res
              .status(201)
              .json({number_of_users: users.length,
                      users: users})
    }

    async getTransactionHistoryUser (req,res) {
      const userID = req.params.id

      let transactions = []
      const buyCardHistory = BuyCardHistory.find(userID)
      const transferHistoryFromRemitterID = TransferHistory.find({remitterID:userID})
      const transferHistoryFromPayeeID = TransferHistory.find({payeeID:userID})
      const depositHistory = DepositHistory.find(userID)
      const withdrawHistory = WithdrawHistory.find(userID)

      transactions = transactions.concat(buyCardHistory)
                                  .concat(transferHistoryFromRemitterID)
                                  .concat(transferHistoryFromPayeeID)
                                  .concat(depositHistory)
                                  .concat(withdrawHistory)

      return res
              .status(201)
              .json({ msg: `transactions from ${userID}: `,
                      number_of_transactions: transactions.length,
                      transactions: transactions})
    }

    async getAllBuyCardHistory (req,res) {

      const buyCards = await BuyCardHistory.find()

      return res
              .status(201)
              .json({ number_of_transactions: buyCards.length,
                      buyCards: buyCards})
    }

    async getAllTransferHistory (req,res) {

      const transfers = await TransferHistory.find()

      return res
              .status(201)
              .json({ number_of_transactions: transfers.length,
                      transfers: transfers})
    }

    async getAllDepositHistory (req,res) {

      const deposits = await DepositHistory.find()

      return res
              .status(201)
              .json({ number_of_transactions: deposits.length,
                      deposits: deposits})
    }

    async getAllWithdrawHistory (req,res) {

      const withdraws = await WithdrawHistory.find()

      return res
              .status(201)
              .json({ number_of_transactions: withdraws.length,
                      withdraws: withdraws})
    }

  }

  module.exports = new AdminController();