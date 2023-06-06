const express = require("express");
const router = express.Router();

//controllers
const UserController  = require('../controllers/UserController');

//middleware
const isAuthenticated = require('../controllers/middleware/isAuthenticated')
//routers
router.get('/',UserController.index)
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/firstLogin', isAuthenticated, UserController.firstLogin)
router.post('/changePassword', isAuthenticated, UserController.changePassword)
router.post('/logout',UserController.logout)

module.exports = router;