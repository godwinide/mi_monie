const welcome = require("../sms_templates/welcome");
const alert = require("../sms_templates/welcome");

function sendSMS(account, amount, trans_type, transaction, pin){
    switch(transaction){
        case "welcome_sms":
            welcome(account, pin)
            break;
        case "transaction":
            alert(account, amount, trans_type, transaction)
            break;
    }
}

module.exports = sendSMS;