class FunctionController {
    buycard(req, res) {
      const error = req.flash('error') || '';
      res.render("mainFunction/buycard",{error});
    }

    deposit(req, res) {
      const error = req.flash('error') || '';
      const cardCode = req.flash('cardCode') || '';
      const date = req.flash('date') || '';
      const CVV = req.flash('CVV') || '';
      const money = req.flash('money') || '';
      res.render("mainFunction/deposit",{error,cardCode,date,CVV,money});
    }

    tranfer(req, res) {
      const error = req.flash('error') || '';
      const phone = req.flash('phone') || '';
      const money = req.flash('money') || '';
      const fee = req.flash('fee') || '';
      const note = req.flash('note') || '';
      res.render("mainFunction/tranfer",{error,phone,money,fee,note});
    }

    withdraw(req, res) {
      const error = req.flash('error') || '';
      const cardCode = req.flash('cardCode') || '';
      const date = req.flash('date') || '';
      const CVV = req.flash('CVV') || '';
      const money = req.flash('money') || '';
      const note = req.flash('note') || '';
      res.render("mainFunction/withdraw",{error,cardCode,date,CVV,money,note});
    }
  }

  module.exports = new FunctionController();
