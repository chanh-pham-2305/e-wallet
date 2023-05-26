const express = require("express");
const router = express.Router();
const {validationResult} = require('express-validator')

const  FunctionController  = require('../controllers/FunctionController');
const checkSessionLogin = require('../controllers/middleware/checkSessionLogin')
const checkVerification = require('../controllers/middleware/checkVerification')

const User = require('../models/UserModel');
const DepositCard = require('../models/DepositCard');
const WithdrawCard = require('../models/WithdrawCard');
const DepositHistory = require('../models/DepositHistory');
const BuyCardHistory = require('../models/BuyCardHistory');
const WithdrawHistory = require('../models/WithdrawHistory');

const buycardValidator = require("./validators/buycardValidator");
const depositValidator = require("./validators/depositValidator");
const tranferValidator = require("./validators/tranferValidator");
const withdrawValidator = require("./validators/withdrawValidator");

router.get('/buycard',checkSessionLogin,checkVerification,FunctionController.buycard)
router.get('/deposit',checkSessionLogin,checkVerification,FunctionController.deposit)
router.get('/tranfer',checkSessionLogin,checkVerification,FunctionController.tranfer)
router.get('/withdraw',checkSessionLogin,checkVerification,FunctionController.withdraw)

router.post('/buycard',buycardValidator, async(req,res)=>{

    let result = validationResult(req);
    if (result.errors.length === 0) {
        let {provider,cardValue,amount} = req.body;
        cardValue = parseInt(cardValue)
        amount = parseInt(amount)
        const username = req.session.user
        const user_name = await User.findOne({ username });
        if(user_name){
            const sub_balance = user_name.balance - cardValue*amount
            if(sub_balance < 0){
                req.flash('error','Tài khoản không còn đủ tiền,vui lòng nạp thêm')
                return res.redirect('/function/buycard')
            }
            else{
                const randomCode = Math.random().toString().slice(2,7)
                const cardCode = provider+randomCode

                const nameProvider = provider == '11111' ? 'Viettel' : provider == '22222' ? 'Mobifone': 'Vinaphone'
                var day=new Date();
                var today=day.getDate()+'-'+(day.getMonth()+1)+'-'+day.getFullYear();
                today=String(today)
                const newBuyCardHistory= new BuyCardHistory({
                    username: username,
                    provider: nameProvider,
                    cardCode: cardCode,
                    money: cardValue,
                    amount: amount,
                    date: today
                })
                await newBuyCardHistory.save()
                await User.updateOne({ username:user_name.username},{$set: {balance: sub_balance}})
                return res.redirect('/')
            }
        }
        return res.redirect('/function/buycard')
    }
    else{
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }
        req.flash('error', message)
        console.log(message);
        return res.redirect('/function/buycard')
    }
})

router.post('/deposit',depositValidator, async(req, res) => {

    let {cardCode,date,CVV,money} = req.body
    console.log(req.body);
    let result = validationResult(req);
    if (result.errors.length === 0) {
        money=parseInt(money)
        date=String(date)
        const checkCardCode = await DepositCard.findOne({ cardCode });
        const checkDate = await DepositCard.findOne({ date });
        const checkCVV = await DepositCard.findOne({ CVV });

        if(!checkCardCode){
            req.flash('error','Thẻ này không hỗ trợ')
            return res.redirect('/function/deposit')
        }else if(String(checkCardCode.date)!= date){
            req.flash('error','Ngày hết hạn không hợp lệ')
            return res.redirect('/function/deposit')
        }else if(!checkCVV){
            req.flash('error' , 'CVV không hợp lệ')
            return res.redirect('/function/deposit')
        }
        else{
            if(CVV ==='443'){
                if(money > 1000000){
                    req.flash('error','Số tiền không được vượt quá 1.000.000đ')
                    return res.redirect('/function/deposit')
                }
            }else if(CVV === '577'){
                req.flash('error' ,'Thẻ tín dụng không còn đủ tiền')
                return res.redirect('/function/deposit')
            }
            const username = req.session.user
            const user_name = await User.findOne({ username });
            var day=new Date();
            var today=day.getDate()+'-'+(day.getMonth()+1)+'-'+day.getFullYear();
            today=String(today)

            const newDepositHistory= new DepositHistory({
                username: username,
                cardCode: cardCode,
                CVV: CVV,
                money: money,
                date: today
            })

            await newDepositHistory.save()
            await User.updateOne({ username:user_name.username},{$set: {balance: user_name.balance+money}})
        return res.redirect('/')
        }
    }
    else{
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }
        req.flash('error', message)
        req.flash('cardCode',cardCode)
        req.flash('date',date)
        req.flash('CVV',CVV)
        req.flash('money',money)
        return res.redirect('/function/deposit')
    }
})

router.post('/tranfer',tranferValidator, async(req, res) => {

    console.log(req.body);
    let {phone,money,fee,note} = req.body
    let result = validationResult(req);
    if (result.errors.length === 0) {
        return res.redirect('/function/tranfer')
    }
    else{
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }
        req.flash('error', message)
        req.flash('phone',phone)
        req.flash('money',money)
        req.flash('fee',fee)
        req.flash('note',note)
        return res.redirect('/function/tranfer')
    }

})

router.post('/withdraw',withdrawValidator,async(req, res)=> {
    let {cardCode,date,CVV,money,note} = req.body
    let result = validationResult(req);
    if (result.errors.length === 0) {
        const username = req.session.user
        const user_name = await User.findOne({ username });
        money=parseInt(money)
        date=String(date)
        const checkCardCode = await WithdrawCard.findOne({ cardCode });
        const checkCVV = await WithdrawCard.findOne({ CVV });
        //chưa check 1 ngày 2 lần giao dịch
        if(!checkCardCode){
            req.flash('error','Thẻ này không hỗ trợ để rút tiền')
            return res.redirect('/function/withdraw')
        }else if(String(checkCardCode.date)!= date){
            req.flash('error','Ngày hết hạn không hợp lệ')
            return res.redirect('/function/withdraw')
        }else if(!checkCVV){
            req.flash('error' , 'CVV không hợp lệ')
            return res.redirect('/function/withdraw')
        }
        else{
            const sub_balance = user_name.balance - (100+5)*money /100
            if (sub_balance < 0) {
                req.flash('error','Tài khoản không còn đủ tiền')
                return res.redirect('/function/withdraw')
            }
            else{
                var day=new Date();
                var today=day.getDate()+'-'+(day.getMonth()+1)+'-'+day.getFullYear();
                today=String(today)
                let status;
                if(money < 5000000){
                    status = 'success'
                    await User.updateOne({ username:user_name.username},{$set: {balance: sub_balance}})
                }
                else{
                    status = 'wait_verification'
                }

                const newWithdrawHistory= new WithdrawHistory({
                    username: username,
                    cardCode: cardCode,
                    money: money,
                    note: note,
                    date: today,
                    status: status,
                })
                await newWithdrawHistory.save()
                return res.redirect('/')
            }
        }
    }
    else{
        result = result.mapped()

        let message;
        for (fields in result) {
            message = result[fields].msg
            break;
        }
        req.flash('error', message)
        req.flash('cardCode',cardCode)
        req.flash('date',date)
        req.flash('CVV',CVV)
        req.flash('money',money)
        req.flash('note',note)
        return res.redirect('/function/withdraw')
    }
})


module.exports = router;