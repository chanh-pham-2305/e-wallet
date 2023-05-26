
const express=require('express')
const mongoose = require('mongoose')
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit')
const bodyParser=require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const app=express()
app.set('view engine','ejs')

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));
app.use(cookieParser('abc'));
app.use(session({ cookie: { maxAge: 24*60*60*1000 }}));
app.use(flash());

const AdminRouter = require('./routers/AdminRouter');
const UserRouter = require('./routers/UserRouter')
const FunctionRouter = require('./routers/FunctionRouter')
const connectDB = require('./db/connect')

app.use('/',UserRouter)
app.use('/admin/', AdminRouter);
app.use('/function/',FunctionRouter);

app.use((req, res) => {
    res.status(404);
    res.render('404');
})
app.use((err,req,res,next) => {
    console.error(err.message);
    res.status(500);
    res.render('500');
})
const port= process.env.PORT || 8080

const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`server listen on port: ${port}`))
    } catch (error) {
        console.log(error);
    }
}

start()