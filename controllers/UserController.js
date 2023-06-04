
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

//models
const User = require('../models/User');

//validators
const registerValidator = require('../routers/validators/registerValidator')
const loginValidator = require('../routers/validators/loginValidator')
const firstLoginValidator = require('../routers/validators/firstLoginValidator')
const changePasswordValidator = require('../routers/validators/changePasswordValidator')
class UserController {
  async index(req, res) {

    if(!req.session.user){
      return res.redirect('/login');
    }
    const user = req.session.user;
    const detailUser = await User.findOne({user})
    const formatMoney = (value) => {
      var money = value.toString().split('');
      var ii = 0;
      for(var i = money.length - 1; i > 0; i--) {
          ii++;
          if(ii%3 == 0) {
              money.splice(i, 0, ",");
          }
      }
      return money.join('');
    }
    let userDetail ={
      fullname: detailUser.fullname,
      phone: detailUser.phone,
      email: detailUser.email,
      date: detailUser.date,
      address: detailUser.address,
      username: detailUser.username,
      balance: detailUser.balance,
      status: '',
    }
    if(detailUser.status == 'wait_verification'){
      userDetail.status = 'Chờ xác minh'
    }
    else if(detailUser.status == 'wait_update'){
      userDetail.status = 'Chờ cập nhật'
    }
    else if(detailUser.status == 'locked'){
      userDetail.status = 'Đã khóa'
    }
    else{
      userDetail.status = 'Đã xác minh'
    }
    userDetail.balance = formatMoney(parseInt(userDetail.balance))
    const error_verification = req.flash('error_verification') || ''
    res.render('user/index', {userDetail,error_verification});
  }

  homePageLogin(req, res) {
    if (req.session.user) {
      return res.redirect('/')
    }
    return res.status(201).send('home login')
  }

  homePageRegister(req, res) {
    return res.status(201).send('home get register')
  }

  homePageResetPassword(req, res) {
    return res.status(201).send('home reset password')
  }
  homePageChangePassword(req, res) {
    return res.status(201).send('home change password')
  }
  homePageFirstLogin(req, res) {
    return res.status(201).send('home first login')
  }
  homePageLogout(req, res) {
    return res.status(201).send('home logout')
  }
  async register(req,res){
    //check error when validator data
    const {error} = registerValidator(req.body)
    if(error) return res.status(402).send(error.details[0].message)

    const {
        phone,
        email,
        fullname,
        date,
        address
        } = req.body;

    const user_phone = await User.findOne({ phone });
    const user_email = await User.findOne({ email });

    if (user_phone) {
        return res.status(404).json({ msg: 'Phone number registered'})
    }
    if (user_email) {
        return res.status(404).json({ msg: 'Email registered'})
    }
    const randomPassword = Math.random().toString(36).slice(2,8)
    const password = await bcrypt.hash( randomPassword , 10);
    const user = await User.create({
        phone,
        email,
        fullname,
        date,
        address,
        password,
    });

    return res.status(201).json({msg:'Account created successfully', user: user,firstPassword: randomPassword})
  }

  async login (req, res){
      //check error when validator data
      const {error} = loginValidator(req.body)
      if(error) return res.status(402).send(error.details[0].message)

      const {username, password} = req.body;
      try {
          //check phone or email
          var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

          let existingUser = username.match(validRegex) ?
                            await User.findOne({ email:username }):
                            await User.findOne({ phone:username })

          let success = await bcrypt.compare(password, existingUser.password);

          if(existingUser.username == 'admin' && success){
              return res.send('admin page')
          }
          else if(existingUser.isFirstLogin && success){
              return res.redirect('/firstLogin')
          }
          else if(!success){
              return res.status(404).json({msg: 'password incorrect'})
          }

          const accessToken = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY)

          return res.status(201)
                    .cookie('token', accessToken)
                    .json({
                          msg:'Login successfully',
                          user:{
                            username:username,
                            password:password,
                            accessToken:accessToken
                          }
                        })
      }
      catch (err) {
        console.log(err);
        return res.status(404).json({msg: 'Unregistered phone number or email'})
      }
  }

  async firstLogin (req, res){
    const {error} = firstLoginValidator(req.body)
    if(error) return res.status(402).send(error.details[0].message)

    const { password } = req.body;

    //check authentication
    //{}
    let username = ''

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatePassword = await User.updateOne({ username:username},{$set: {hashedPassword: hashedPassword, isFirstLogin: false}})

    return res.status(201).json({msg:'Change password successfully when logging in for the first time', user:{username,updatePassword}})
  }

  async changePassword (req, res){
    const {error} = changePasswordValidator(req.body)
    if(error) return res.status(402).send(error.details[0].message)

    const username = ''
    const {oldPassword, password} = req.body;
    const user_username = await User.findOne({ username });
    const success = await bcrypt.compare(oldPassword, user_username.hashedPassword);

    if(!success) {
      return res.status(402).json({msg: 'Incorrect old password'})
    }
    else{
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatePassword = await User.updateOne({ username:username}, {$set: {hashedPassword: hashedPassword}})
      return res.status(201).json({msg: 'change password success', password:password})
    }
  }
}

module.exports = new UserController();
