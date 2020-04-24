const axios = require("axios");
const padMinutes = require("../utils/padMinutes");

module.exports = function (account, amount, trans_type, transaction){
    const body = `Dear ${account.account_number}, your account has been ${transaction.transaction_type}ed with ${amount}. Account Balance: ${transaction.available_balance}.`;
    axios(`https://portal.nigeriabulksms.com/api/?username=enaland39@gmail.com&password=doxabet2020&message=${body}&sender=Enaland Bank&verbose=true&mobiles=234${String(account.phone_number).slice(1)}`)
    .then(res => {
        console.log(res.data);
    })
}
