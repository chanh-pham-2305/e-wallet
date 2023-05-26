const {check} = require('express-validator')

const firstLoginValidator = [

    check('password').exists().withMessage('Vui lòng nhập mật khẩu mới')
    .notEmpty().withMessage('Không được để trống mật khẩu mới')
    .isLength({min: 6,max:6}).withMessage('Mật khẩu phải có 6 ký tự'),

    check('rePassword').exists().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .notEmpty().withMessage('Vui lòng nhập xác nhận mật khẩu')
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Mật khẩu không khớp')
        }
        return true;
    })
]

module.exports = firstLoginValidator