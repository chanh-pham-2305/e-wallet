const {check} = require('express-validator')

const tranferValidator = [

    check('phone').exists().withMessage('Vui lòng nhập số điện thoại')
    .notEmpty().withMessage('Không được để trống số điện thoại')
    .isLength({min: 10,max:10}).withMessage('Số điện thoại phải có 10 kí tự'),

    check('money').exists().withMessage('Vui lòng nhập số tiền chuyển')
    .notEmpty().withMessage('Không được để trống số tiền chuyển')
    .isInt().withMessage('Vui lòng nhập số'),

    check('fee').exists().withMessage('Vui lòng chọn người trả phí')
    .notEmpty().withMessage('Vui lòng chọn người trả phí')

]

module.exports = tranferValidator