const nodeMailer = require('nodemailer')

 const adminEmail = 'chanhpham235@gmail.com'
 const adminPassword = 'cgacbbrwwwampgns'

//  const mailHost = 'smtp.gmail.com'
//  const mailPort = 465

 const sendMail = async (email, subject, notes) => {
  try {
    const transporter = nodeMailer.createTransport({
      //  host: mailHost,
      //  port: mailPort,
       secure: 'gmail',
       auth: {
         user: adminEmail,
         pass: adminPassword
       }
     })
     const options = {
       from: adminEmail,
       to: email,
       subject: subject,
       text: notes
     }
     await transporter.sendMail(options)

     console.log("gửi mail thành công.");
  } catch (error) {
    console.log(error,'gửi mail thất bại');
  }
 }
 module.exports = sendMail
