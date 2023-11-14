const express = require("express");
const router = express.Router();

const upload = require('../utils/multer')
//controllers
const UserController  = require('../controllers/UserController');

//middleware
const isAuthenticated = require('../controllers/middleware/isAuthenticated')

//routers
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/firstLogin', isAuthenticated, UserController.firstLogin)
router.post('/changePassword', isAuthenticated, UserController.changePassword)
router.post('/upload_photo', isAuthenticated,upload, UserController.upload_photo)
router.post('/logout',UserController.logout)

module.exports = router;