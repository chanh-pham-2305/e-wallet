const express = require("express");
const router = express.Router();

//controllers
const UserController  = require('../controllers/UserController');

//middleware
const verifyToken = require("../controllers/middleware/verifyToken")

//utils
// const sendEmail = require('../utils/mailer');

router.get('/',UserController.index)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/firstLogin', UserController.firstLogin)
router.post('/changePassword',UserController.changePassword)
//reset password
router.get('/logout',UserController.homePageLogout)

module.exports = router;