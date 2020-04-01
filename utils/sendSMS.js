const welcome = require("../sms_templates/welcome");
const alert = require("../sms_templates/alert");

function sendSMS(account, amount, trans_type, transaction, pin=null){
    switch(trans_type){
        case "welcome_sms":
            welcome(account, pin);
            break;
        case "transaction":
            alert(account, amount, trans_type, transaction)
            break;
    }
}

module.exports = sendSMS;