const User = require('../../models/User')
const jwt = require('jsonwebtoken')

const isAuthenticated = async (req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(201).send('Please login to access the data')
        }
        const verify = await jwt.verify(token,process.env.SECRET_KEY)
        req.user = await User.findById(verify.id)
        next();
    } catch (error) {
       return next(error);
    }
}

module.exports = isAuthenticated;