const express = require("express");
const router = express.Router();

//controllers
const  AdminController  = require('../controllers/AdminController');

router.get('/',AdminController.index)
router.get('/getUser',AdminController.getUser)
router.get('/getAllUsers',AdminController.getAllUsers)
router.get('/getTransactionHistoryUser',AdminController.getTransactionHistoryUser)
router.get('/getAllBuyCardHistory',AdminController.getAllBuyCardHistory)
router.get('/getAllTransferHistory',AdminController.getAllTransferHistory)
router.get('/getAllDepositHistory',AdminController.getAllDepositHistory)
router.get('/getAllWithdrawHistory',AdminController.getAllWithdrawHistory)

module.exports = router;