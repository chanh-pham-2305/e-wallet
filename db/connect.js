const mongoose = require('mongoose')

const connectDB = (url) =>{
    return mongoose
            .connect(url,{
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(()=>{
                console.log('connect to DB success...');
            })
            .catch(error => console.log('can\'t connect to DB: ' + error.message))
}

module.exports = connectDB