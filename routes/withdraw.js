const router = require("express").Router();
const Account = require("../model/Account");
const History = require("../model/History");
const uuid = require("uuid").v4;
const sendEmail = require("../utils/sendMail");
const sendSMS = require("../utils/sendSMS");

const { ensureAuthenticated } = require('../config/auth');


router.get("/", ensureAuthenticated, (req,res) => {
    res.render("withdraw", {req});
});

router.post("/", ensureAuthenticated, (req,res) => {
    const {account_number, amount} = req.body;
    const errors = [];
    const success = [];

    if(isNaN(amount)){
        errors.push({msg: "Please provide a valid amount"});
    }

    Account.findOne({account_number})
        .then(account => {
            if(!account){
                errors.push({msg: "No matching account with that account number"});
                return res.render("withdraw", {
                    req,
                    errors,
                    account_number
                });
            }

            if(parseInt(account.balance) < Math.abs(parseInt(amount))){
                errors.push({msg: "insufficient funds"})

                const current_balance = account.balance;
                //add to general history
                const new_history = {
                    transaction_type: "debit",
                    id: uuid(),
                    amount,
                    account_number,
                    teller_id: req.user.teller_id,
                    current_balance,
                    description: "cash withdrawer",
                    availavble_balance: account.balance,
                    balance: account.balance,
                    self: true,
                    date: new Date(),
                    status: "declined"
                }

                const new_gen_history = new History(new_history);
                new_gen_history.save()
                    .then(()=> {
                        const account_history = account.history;
                        account_history.push(new_history);

                        Account.findOneAndUpdate(
                            {account_number},
                            {history: account_history}
                        )
                        .then(() => {
                            return res.render("withdraw", {
                                req,
                                errors,
                                account_number
                            });
                        })
                    })
            }else{
                // validation passed
                //add to general history
                const new_history = {
                    transaction_type: "debit",
                    id: uuid(),
                    amount,
                    credit: "",
                    debit: amount,
                    account_number,
                    teller_id: req.user.teller_id,
                    description: "cash withdrawer",
                    current_balance: account.balance,
                    available_balance: (parseInt(account.balance) - parseInt(amount)),
                    balance: (parseInt(account.balance) - parseInt(amount)),
                    self: true,
                    date: new Date(),
                    status: "success"
                }

                const new_gen_history = new History({
                    transaction_type: "debit",
                    account,
                    amount,
                    credit: "",
                    debit: amount,
                    account_number,
                    teller_id: req.user.teller_id,
                    description: "cash withdrawer",
                    current_balance: account.balance,
                    availavble_balance: (parseInt(account.balance) - parseInt(amount)),
                    balance: (parseInt(account.balance) - parseInt(amount)),
                    self: true,
                    status: "success"
                });
                new_gen_history.save()
                    .then(()=> {
                        const account_history = account.history;
                        account_history.push(new_history);

                        Account.findOneAndUpdate(
                            {account_number},
                            {balance: new_history.balance,$inc:{billing_balance: account.billing_balance + 3}, history: account_history}
                        )
                        .then(() => {
                            
                            success.push({msg: "Withdraw successful"})
                            // send sms
                            sendSMS(account, amount, "transaction", new_history)
                            // send email
                            sendEmail(account, amount, "transaction", new_history);
                            setTimeout(()=>{
                                return res.render("withdraw", {
                                    req,
                                    success
                                });
                            },0)
                        })
                    })
            }
        })
});


module.exports = router;