const express = require("express");
const router = express.Router();
const  AdminController  = require('../controllers/AdminController');

router.get('/',AdminController.index)
router.get('/active',AdminController.active)
router.get('/history',AdminController.history)
router.get('/disable',AdminController.disable)
router.get('/lock',AdminController.lock)
router.get('/nonactive',AdminController.nonactive)
router.get('/submit',AdminController.submit)
router.get('/add',AdminController.add)

module.exports = router;