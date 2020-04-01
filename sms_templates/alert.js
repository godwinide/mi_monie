const axios = require("axios");
const padMinutes = require("../utils/padMinutes");

module.exports = function (account, amount, trans_type, transaction){
    const body = `Dear ${account.lastname} ${account.firstname} ${account.middlename}
        We wish to notify you that your account has been ${transaction.transaction_type}ed with
        ${amount}.
        Account balance as at ${new Date().toLocaleDateString()} ${new Date().getHours()}: ${padMinutes(new Date().getMinutes())}-
        Current Balance:  ${transaction.current_balance}
        Available Balance:  ${transaction.available_balance}
        Description: ${transaction.description}
        Teller_ID: ${transaction.teller_ID}
        Value Date: ${new Date().toLocaleDateString()}`

        axios(`https://portal.nigeriabulksms.com/api/?username=enaland39@gmail.com&password=doxabet2020&message=${body}&sender=mymonie&verbose=true&mobiles=234${String(account.phone_number).slice(1)}`)
        .then(res => {
            console.log(res.data);
        })
}
