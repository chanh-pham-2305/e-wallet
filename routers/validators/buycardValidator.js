const {check} = require('express-validator')

const buycardValidator = [

    // check('numberPhone').exists().withMessage('Vui lòng nhập số điện thoại')
    // .notEmpty().withMessage('Không được để trống số tài khoản')
    // .isLength({min: 6,max:6}).withMessage('Số tài khoản phải có 6 kí tự'),

    check('provider').exists().withMessage('Vui lòng chọn nhà mạng')
    .notEmpty().withMessage('Không được để trống nhà mạng'),

    check('cardValue').exists().withMessage('Vui lòng chọn giá trị thẻ điện thoại cần mua')
    .notEmpty().withMessage('Không được để trống giá trị thẻ'),

    check('amount').exists().withMessage('Vui lòng chọn số lượng thẻ cần mua')
    .notEmpty().withMessage('Không được để trống số lượng thẻ'),
]

module.exports = buycardValidator