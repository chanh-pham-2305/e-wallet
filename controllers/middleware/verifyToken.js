const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const verifyToken = (req,res,next) =>{
    try {
        let accessToken = req.headers.authorization
        if(accessToken){
            token = accessToken.split(" ")[1]
            console.log(token);
            // let user = jwt.verify(token, process.env.SECRET_KEY)
        }
        else{
            return res.status(401).json({msg: 'Unauthorized user'})
        }

        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({msg: 'Unauthorized user'})
    }
}

module.exports = verifyToken