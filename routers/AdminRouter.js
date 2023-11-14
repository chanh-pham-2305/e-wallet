const express = require("express");
const router = express.Router();

//controllers
const  AdminController  = require('../controllers/AdminController');


//routers
router.get('/user/:id',AdminController.getUser)
router.get('/users',AdminController.getAllUsers)
router.get('/history/transactions/:id',AdminController.getTransactionHistoryUser)
router.get('/history/buyCard',AdminController.getAllBuyCardHistory)
router.get('/history/transfer',AdminController.getAllTransferHistory)
router.get('/history/deposit',AdminController.getAllDepositHistory)
router.get('/history/withdraw',AdminController.getAllWithdrawHistory)

module.exports = router;