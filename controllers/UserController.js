
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
    return res.status(201).send('home page')
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
      if(error) return res
                        .status(402)
                        .send(error.details[0].message)

      const {username, password} = req.body;

      try {

        //check admin
          if(username == process.env.ADMIN && (password === process.env.PASS_ADMIN)){
              return res.send('admin page')
          }
          //check phone or email
          var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

          let existingUser = username.match(validRegex) ?
                            await User.findOne({ email:username }):
                            await User.findOne({ phone:username })

          let success = await bcrypt.compare(password, existingUser.password);

          if(!success){
              return res
                      .status(404)
                      .json({msg: 'password incorrect'})
          }

          const accessToken = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY)
          res.cookie('token', accessToken)

          if(existingUser.isFirstLogin && success){
            return res
                    .status(201)
                    .send('please change password when user login for the first time, login -> firstLogin')
          }

          return res.status(201)
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
        return res
                .status(404)
                .json({msg: 'Unregistered phone number or email'})
      }
  }

  async firstLogin (req, res){
    const {error} = firstLoginValidator(req.body)
    if(error) return res
                      .status(402)
                      .send(error.details[0].message)

    const { password } = req.body;

    const _id = req.user._id

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate( _id,
                                                    { password: hashedPassword,
                                                      isFirstLogin: false },
                                                    { new: true})

    return res
            .status(201)
            .json({ msg:'Change password successfully when logging in for the first time',
                    user:updatedUser})
  }

  async changePassword (req, res){
    const {error} = changePasswordValidator(req.body)
    if(error) return res
                      .status(402)
                      .send(error.details[0].message)

    const { oldPassword,
            password } = req.body;

    const { _id, } = req.user._id

    if (oldPassword === password) return res
                                          .status(404)
                                          .json({msg: 'New password must different old password'})

    const checkOldPassword = await bcrypt.compare(oldPassword, req.user.password)
    if(!checkOldPassword) return res
                                  .status(404)
                                  .json({ msg: 'Old password is not correct, please try again'})

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate( _id,
                                                    { password: hashedPassword},
                                                    { new: true})

    return res
            .status(201)
            .json({ msg:'Change password successfully',
                    user:updatedUser})
  }

  async logout (req, res){

    let token_cookie = 'token'
    let cookies = req.cookies

    if (!Object.hasOwnProperty.bind(cookies)(token_cookie)) return res
                                                                    .status(404)
                                                                    .send('user can not logout')

    //clear token
    res.clearCookie('token')

    return res
            .status(201)
            .send('logout successfully')
  }
}

module.exports = new UserController();
