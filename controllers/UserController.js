const User = require('../models/UserModel');

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

  login(req, res) {
    console.log(req.session.user);
    if (req.session.user) {
      return res.redirect('/')
    }
    const error = req.flash('error') || ''
    const username = req.flash('username') || ''
    const password = req.flash('password') || ''
    res.render("user/login",{error,username,password});
  }

  register(req, res) {
    const error = req.flash('error') || ''
    const phone = req.flash('phone') || ''
    const email = req.flash('email') || ''
    const fullname = req.flash('fullname') || ''
    const date = req.flash('date') || ''
    const address = req.flash('address') || ''
    res.render('user/register', {error, phone, email,fullname,date,address})
  }

  resetPassword(req, res) {
    res.render("user/resetPassword");
  }

  changePassword(req, res) {
    const error = req.flash('error') || ''
    res.render("user/changePassword",{error});
  }

  firstLogin(req, res) {
    const error = req.flash('error') || ''
    res.render("user/firstLogin",{error});
  }
  reuploadPhoto(req, res) {
    res.render("user/reuploadPhoto");
  }
  logout(req, res) {
    // req.session.destroy()
    res.render("user/login",{error:''});
  }
}

module.exports = new UserController();
