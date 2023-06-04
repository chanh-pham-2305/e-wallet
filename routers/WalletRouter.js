const express = require("express");
const router = express.Router();

//controllers
const WalletController  = require('../controllers/WalletController');
const BankAccountController = require('../controllers/BankAccountController')

//middleware
const isAuthenticated = require('../controllers/middleware/isAuthenticated')

//transactions
router.post('/buyCard', isAuthenticated, WalletController.buyCard)
router.post('/transfer', isAuthenticated, WalletController.transfer)
router.post('/deposit', isAuthenticated, WalletController.deposit)
router.post('/withdraw', isAuthenticated, WalletController.withdraw)

//bank account
router.post('/createBankAccount',isAuthenticated, BankAccountController.createAccount)
router.post('/updateMoneyBankAccount',isAuthenticated, BankAccountController.updateMoneyBankAccount)

module.exports = router;