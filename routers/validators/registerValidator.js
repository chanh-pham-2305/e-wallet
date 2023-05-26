const {check} = require('express-validator')

const registerValidator = [
    check('phone').exists().withMessage('Vui lòng nhập số điện thoại người dùng')
    .notEmpty().withMessage('Không được để trống số điện thoại người dùng')
    .isLength({min: 10, max: 10}).withMessage('Số điện thoại phải đầy đủ 10 chữ số'),

    check('email').exists().withMessage('Vui lòng nhập email người dùng')
    .notEmpty().withMessage('Không được để trống email người dùng')
    .isEmail().withMessage('Đây không phải là email hợp lệ'),

    check('fullname').exists().withMessage('Vui lòng nhập họ tên người dùng')
    .notEmpty().withMessage('Không được để trống họ tên người dùng')
    .isLength({min: 5}).withMessage('Họ tên người dùng phải từ 5 ký tự'),

    check('date').exists().withMessage('Vui lòng nhập ngày tháng năm sinh')
    .notEmpty().withMessage('Không được để trống ngày tháng năm sinh'),

    check('address').exists().withMessage('Vui lòng nhập địa chỉ')
    .notEmpty().withMessage('Không được để trống địa chỉ'),
]

module.exports = registerValidator