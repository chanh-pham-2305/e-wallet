const {check} = require('express-validator')

const depositValidator = [

    check('cardCode').exists().withMessage('Vui lòng nhập số tài khoản')
    .notEmpty().withMessage('Không được để trống số tài khoản')
    .isLength({min: 6,max:6}).withMessage('Số tài khoản phải có 6 kí tự'),

    check('date').exists().withMessage('Vui lòng nhập ngày hết hạn')
    .notEmpty().withMessage('Không được để trống ngày hết hạn'),

    check('CVV').exists().withMessage('Vui lòng nhập CVV')
    .notEmpty().withMessage('Vui lòng nhập mã CVV')
    .isLength({min: 3,max:3}).withMessage('Mã CVV phải có 3 kí tự'),

    check('money').exists().withMessage('Vui lòng nhập số tiền')
    .notEmpty().withMessage('Vui lòng nhập số tiền')
    .isInt().withMessage('Số tiền nhập phải là số')
]

module.exports = depositValidator