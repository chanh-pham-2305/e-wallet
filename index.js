const express=require('express')
const cookieParser = require('cookie-parser')
const bodyParser=require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const app=express()

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

//routers
const UserRouter = require('./routers/UserRouter')
const WalletRouter = require('./routers/WalletRouter')
const AdminRouter = require('./routers/AdminRouter');

//connect to database
const connectDB = require('./db/connect')

app.use('/api/v1/', UserRouter)
app.use('/api/v1/wallet/', WalletRouter);
app.use('/api/v1/admin/', AdminRouter);


app.use((req, res) => {
    return res
            .status(404)
            .json({msg: 'page not found'})
})
app.use((err,req,res,next) => {
    console.log(err);
    return res
            .status(500)
            .json({msg: 'error server'})
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