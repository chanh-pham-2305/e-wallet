const {check} = require('express-validator')

const loginValidator = [

    check('username').exists().withMessage('Vui lòng nhập tên người dùng')
    .notEmpty().withMessage('Không được để trống tên người dùng')
    .isLength({min: 5,max: 10}).withMessage('Tài khoản phải gồm 10 chữ số'),

    check('password').exists().withMessage('Vui lòng nhập mật khẩu.')
    .notEmpty().withMessage('Không được để trống mật khẩu người dùng')
    .isLength({min: 6,max: 6}).withMessage('Mật khẩu phải có 6 ký tự'),
]

module.exports = loginValidator