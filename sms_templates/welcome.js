const axios = require("axios");

module.exports = function (account, pin){
    const body = `
congratulations ${account.lastname} ${account.firstname} ${account.middlename}.Your Account has been registered:
Account Number:  ${account.account_number};
Your login password/pin: ${pin}
Account Balance: ${account.balance}`;

        axios(`https://portal.nigeriabulksms.com/api/?username=enaland39@gmail.com&password=doxabet2020&message=${body}&sender=Enaland&verbose=true&mobiles=234${String(account.phone_number).slice(1)}`)
        .then(res => {
            console.log("sending sms")
            console.log(res.data);
        })
}
