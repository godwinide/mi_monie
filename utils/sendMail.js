const nodemailer = require("nodemailer");
const welcome_email = require("../email_templates/welcome_email");
const alert_email = require("../email_templates/alert");


async function sendEmail(account, amount, trans_type, transaction) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: false,
    secure: 587,
    auth: {
      user: "craftyprogrammer@gmail.com",
      pass: "godwin222sm" 
    }
  });

  const email_data = {
    subject: "",
    html: ""
  };

  // send mail with defined transport object
  // check the email type

  switch(trans_type){
    case "welcome_email":
      email_data.subject = "congratulations"
      email_data.html = welcome_email(account)
      break;
    case "transaction":
      email_data.subject = `ENS Transaction Alert [${transaction.transaction_type}: ${amount} ]`;
      email_data.html = alert_email(account, transaction);
      break;
  }

  transporter.sendMail({
    from: '"Enaland Bank" suport@enaland.com',
    to: account.email,
    ...email_data 
  })

}


module.exports = sendEmail;