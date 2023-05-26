const express = require("express");
const router = express.Router();
const fs = require('fs');
const {validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
var multer = require('multer');
const path = require('path');
let loginFail = 0;
let DateFailed = 0;
const  UserController  = require('../controllers/UserController');
const User = require('../models/User');
const registerValidator = require('./validators/registerValidator')
const loginValidator = require('./validators/loginValidator')
const changePasswordValidator = require('./validators/changePasswordValidator')
const firstLoginValidator = require("./validators/firstLoginValidator");
const sendEmail = require('../utils/mailer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/');
    },
    filename: (req, file, cb) => {
        let namefile = file.fieldname+ '-'+ Date.now()
        cb(null , namefile);
    }
})

var upload = multer({storage:storage});
const mutiUpload = upload.fields([
    {name:'front_photo',maxCount: 1},
    {name:'back_photo',maxCount: 1},
])
router.get('/',UserController.index)
router.get('/login',UserController.login)
router.get('/register',UserController.register)
router.get('/resetPassword',UserController.resetPassword)
router.get('/changePassword',UserController.changePassword)
router.get('/firstLogin',UserController.firstLogin)
router.get('/reuploadPhoto',UserController.reuploadPhoto)
router.get('/logout',UserController.logout)

router.post('/register',registerValidator, mutiUpload,  async (req, res) => {
    console.log(req);
    let result = validationResult(req);
        if (result.errors.length === 0){
            const {phone,email,fullname,date,address,front_photo,back_photo} = req.body;

            const user_phone = await User.findOne({ phone });
            const user_email = await User.findOne({ email });
            console.log(user_phone,user_email);
            if (user_phone) {
                req.flash('error','Số điện thoại đã được đăng ký')
                return res.redirect('/register')
            }
            if (user_email) {
                req.flash('error','Email đã được đăng ký')
                return res.redirect('/register')
            }
            if(front_photo == '' || back_photo == '') {
                req.flash('error','Vui lòng nhập cả 2 ảnh 2 mặt CMND')
                return res.redirect('/register')
            }
            if (!user_email && !user_phone) {
                // const username = Math.random().toString().slice(2,12)

                const password = await bcrypt.hash( Math.random().toString(36).slice(2,8) , 10);

                const newUser = new User({
                    phone,
                    email,
                    fullname,
                    date,
                    address,
                    password,
                });
                //log information
                console.log(phone,email,password);

                const savedUser = await newUser.save();
                // const subject = 'Bạn đã đăng ký thành công tài khoản ví điện tử của chúng tôi.'
                // const notes = ` Tài khoản của bạn là:
                //                 Tên tài khoản: ${username}
                //                 Mật khẩu: ${password} `
                // await sendEmail(email,subject,notes)

                // console.log(`${subject}:
                //             ${notes}`);
                req.flash('error',`${phone}:
                                        ${password}`)
                return res.redirect('/login')
            }
        }
        else{
            result = result.mapped()

            let message;
            for (fields in result) {
                message = result[fields].msg
                break;
            }
            const {phone, email,fullname,date,address} = req.body
            req.flash('error', message)
            req.flash('phone', phone)
            req.flash('email', email)
            req.flash('fullname', fullname)
            req.flash('date', date)
            req.flash('address', address)
            return res.redirect('/register')
        }
})

router.post('/login', loginValidator, async (req, res) => {
    let result = validationResult(req);
    if (result.errors.length === 0) {
        const {username, password} = req.body;
        try {
            const user_username = await User.findOne({ username });
            const success = await bcrypt.compare(password, user_username.hashedPassword);
            if(user_username.username == 'admin'){
                if(success){
                    return res.redirect('/admin/')
                }
            }
            if (loginFail == 2){
                setTimeout(function () {
                    DateFailed = 60
                }, 1000*60); // sửa
                console.log(DateFailed);
                if (DateFailed < 60 ) {
                    req.flash('error', 'Tài khoản của bạn đang bị khóa vui long tử lại sau 1 phút')
                    req.flash('username', username)
                    req.flash('password', password)
                    return res.redirect('/login')
                }
                else if(user_username.loginAbnormal == 1 ){

                    await User.updateOne(
                        {
                            username: user_username.username
                        },
                        {
                            $set: {
                                status: 'locked'
                            }
                        }
                    )
                    //thêm

                    req.flash('error', 'Tài khoản đã bị khóa do nhập sai mật khẩu nhiều lần, vui lòng liên hệ quản trị viên để được hỗ trợ')
                    req.flash('username', username)
                    req.flash('password', password)
                    return res.redirect('/login')
                }
                else{
                    req.flash('error', 'Vui lòng nhập mật khẩu đúng')
                    console.log(username);
                    await User.updateOne(
                        {
                            username: user_username.username
                        },
                        {
                            $set: {
                                loginAbnormal: 1
                            }
                        }
                    )
                    loginFail = 0
                    return res.redirect('/login')
                }
            }
            else{
                if (!success) {
                    loginFail += 1
                    console.log(loginFail);
                    req.flash('error', 'Mật khẩu không chính xác')
                    req.flash('username', username)
                    req.flash('password', password)
                    return res.redirect('/login')
                } else {
                    req.session.user = user_username.username
                    if (user_username.isFirstLogin) {
                        return res.redirect('/firstLogin')
                    }
                    return res.redirect('/')
                }
            }

        } catch (error) {
            console.log(error);
            req.flash('error', 'Tên người dùng chưa được đăng ký tài khoản')
            req.flash('username', username)
            req.flash('password', password)
            return res.redirect('/login')
        }
    }
    else{
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }
        const {username, password} = req.body
        req.flash('error', message)
        req.flash('username', username)
        req.flash('password', password)
        res.redirect('/login')
    }
})

router.post('/firstLogin',firstLoginValidator, async (req, res) =>{
    let result = validationResult(req);
    if (result.errors.length === 0) {
        const { password } = req.body;
        const username = req.session.user
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatePassword = await User.updateOne({ username:username},{$set: {hashedPassword: hashedPassword, isFirstLogin: false}})
        return res.redirect('/')
    }
    else{
        result = result.mapped()
        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }

        const { password } = req.body
        req.flash('error', message)
        req.flash('password', password)
        res.redirect('/firstLogin')
    }
})

router.post('/changePassword',changePasswordValidator, async (req, res) =>{
    let result = validationResult(req);
    if (result.errors.length === 0) {
        const username = req.session.user
        const {oldPassword, password} = req.body;
        const user_username = await User.findOne({ username });
        const success = await bcrypt.compare(oldPassword, user_username.hashedPassword);
        if(!success) {
            req.flash('error', 'Mật khẩu cũ không chính xác')
                    req.flash('password', password)
                    return res.redirect('/changePassword')
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatePassword = await User.updateOne({ username:username},{$set: {hashedPassword: hashedPassword}})
            return res.redirect('/')
        }
    }
    else{
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }
        const {username, password} = req.body
        console.log(message);
        req.flash('error', message)
        req.flash('password', password)
        res.redirect('/changePassword')
    }
})

module.exports = router;