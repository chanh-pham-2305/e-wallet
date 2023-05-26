const User = require('../../models/User');
const checkVerification = async (req, res,next) => {
    const username = req.session.user
    let user = await User.findOne({username})
    if (user.status == 'wait_verification') {
        req.flash('error_verification','Tính năng này chỉ dành cho tài khoản đã được xác minh')
        return res.redirect('/')
    }
    next();
}
module.exports = checkVerification;