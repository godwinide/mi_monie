const router = require("express").Router();
const Account = require("../model/Account");
const History = require("../model/History");
const sendMail = require("../utils/sendMail");
const sendSMS = require("../utils/sendSMS");
const uuid = require("uuid").v4;

const { ensureAuthenticated } = require('../config/auth');


router.get("/", ensureAuthenticated, (req,res) => {
    res.render("transfer", {req});
});

router.post("/", ensureAuthenticated, (req,res) => {
    const {account_number, account_number2, amount} = req.body;
    const success = [];
    const errors = [];

    // validation
    if(!account_number || !account_number2 || !amount){
        errors.push({msg: "please fill all fields"});
    }

    if(isNaN(account_number) || isNaN(account_number2) || isNaN(amount)){
        errors.push({msg: "please enter valid credentials"});
    }

    if(errors.length > 0){
        return res.render("transfer", {
            req,
            account_number,
            account_number2,
            errors
        });
    }

    Account.findOne({account_number}, (err, account1) => {
        // check if account exists
        if(!account1){
            errors.push({msg: "no matching account for transfering account number"});
            return res.render("transfer", {
                req,
                account_number,
                account_number2,
                errors
            });
        }
        // check if balance is more tan amount
        if(parseInt(account1.balance) < parseInt(amount)){
            errors.push({msg: "insufficient funds in transfering account"});
            return res.render("transfer", {
                req,
                account_number,
                account_number2,
                errors
            });
        }

        Account.findOne({account_number: account_number2}, (err, account2) => {
            // check if account exists
            if(!account2){
                errors.push({msg: "no matching account for receiver's account number"});
                return res.render("transfer", {
                    account_number,
                    account_number2,
                    errors
                });
            }else{
                // validation passed
                const new_account_history1 = account1.history;
                const new_account_history2 = account2.history;                

                new_account_history1.push({
                    id: uuid(),
                    transaction_type: "debit",
                    debit: parseInt(amount),
                    credit: "",
                    amount,
                    account_number,
                    date: new Date(),
                    teller_id: req.user.teller_id,
                    current_balance: account1.balance,
                    availavble_balance: (parseInt(account1.balance) - parseInt(amount)),
                    balance: (parseInt(account1.balance) - parseInt(amount)),
                    self: true,
                    status: "success"
                });


                new_account_history2.push({
                    id: uuid(),
                    transaction_type: "credit",
                    debit: "",
                    credit: parseInt(amount),
                    amount,
                    account_number,
                    date: new Date(),
                    teller_id: req.user.teller_id,
                    current_balance: account2.balance,
                    availavble_balance: (parseInt(account2.balance) + parseInt(amount)),
                    balance: (parseInt(account2.balance) + parseInt(amount)),
                    self: false,
                    firstname: account1.firstname,
                    lastname: account1.lastname,
                    phone_number: account1.phone_number,
                    status: "success"
                });

                const genHist1 = new History({
                    transaction_type: "debit",
                    account: account2,
                    type: "transfer",
                    amount,
                    description: `Cash transfer to ${account2.account_number} ${account2.lastname} ${account2.firstname} ${account2.middlename} - ${account1.phone_number}`,
                    credit: amount,
                    debit: "",
                    date: new Date(),
                    account_number,
                    teller_id: req.user.teller_id,
                    current_balance: account1.balance,
                    availavble_balance: (parseInt(account1.balance) - parseInt(amount)),
                    balance: (parseInt(account1.balance) - parseInt(amount)),
                    self: true,
                    status: "success"
                });
                const genHist2 = new History({
                    transaction_type: "credit",
                    account: account2,
                    amount,
                    credit: amount,
                    description: `Cash transfer from ${account1.account_number} ${account1.lastname} ${account1.firstname} ${account1.middlename} - ${account1.phone_number}`,
                    date: new Date(),
                    debit: "",
                    teller_id: req.user.teller_id,
                    account_number:account_number2,
                    current_balance: account2.balance,
                    availavble_balance: (parseInt(account2.balance) + parseInt(amount)),
                    balance: (parseInt(account2.balance) + parseInt(amount)),
                    self: true,
                    status: "success"
                });

                Account.findOneAndUpdate(
                    {account_number},
                    {$inc:{"balance": -parseInt(amount), "billing_balance": account1.billing_balance + 3}, history: new_account_history1}
                )
                .then(() => {
                    Account.findOneAndUpdate(
                        {account_number: account_number2},
                        {$inc:{"balance": parseInt(amount), "billing_balance": account2.billing_balance + 3}, history: new_account_history2}
                    )
                    .then(() => {
                        genHist1.save()
                        .then(()=> {
                            genHist2.save()
                            .then(async () => {
                                await success.push({msg: "Transfer successful"});
                                // send sms
                                sendSMS(account1, amount, "transaction", {
                                    transaction_type: "debit",
                                    debit: parseInt(amount),
                                    credit: "",
                                    amount,
                                    account_number,
                                    description: `Cash transfer to ${account2.account_number} ${account2.lastname} ${account2.firstname} ${account2.middlename} - ${account2.phone_number}`,
                                    date: new Date(),
                                    teller_id: req.user.teller_id,
                                    current_balance: account1.balance,
                                    availavble_balance: (parseInt(account1.balance) - parseInt(amount)),
                                    balance: (parseInt(account1.balance) - parseInt(amount)),
                                    self: true,
                                    status: "success"
                                })
                                sendSMS(account2, amount, "transaction", {
                                    transaction_type: "credit",
                                    debit: "",
                                    credit: parseInt(amount),
                                    description: `Cash transfer from ${account1.account_number} ${account1.lastname} ${account1.firstname} ${account1.middlename} - ${account1.phone_number}`,
                                    amount,
                                    account_number,
                                    date: new Date(),
                                    teller_id: req.user.teller_id,
                                    current_balance: account2.balance,
                                    availavble_balance: (parseInt(account2.balance) + parseInt(amount)),
                                    balance: (parseInt(account2.balance) + parseInt(amount)),
                                    self: false,
                                    firstname: account1.firstname,
                                    lastname: account1.lastname,
                                    phone_number: account1.phone_number,
                                    status: "success"
                                })
                                // send email
                                sendMail(account1, amount, "transaction", {
                                    transaction_type: "debit",
                                    debit: parseInt(amount),
                                    credit: "",
                                    amount,
                                    account_number,
                                    description: `Cash transfer to ${account2.account_number} ${account2.lastname} ${account2.firstname} ${account2.middlename} - ${account2.phone_number}`,
                                    date: new Date(),
                                    teller_id: req.user.teller_id,
                                    current_balance: account1.balance,
                                    availavble_balance: (parseInt(account1.balance) - parseInt(amount)),
                                    balance: (parseInt(account1.balance) - parseInt(amount)),
                                    self: true,
                                    status: "success"
                                });
                                sendMail(account2, amount, "transaction", {
                                    transaction_type: "credit",
                                    debit: "",
                                    credit: parseInt(amount),
                                    description: `Cash transfer from ${account1.account_number} ${account1.lastname} ${account1.firstname} ${account1.middlename} - ${account1.phone_number}`,
                                    amount,
                                    account_number,
                                    date: new Date(),
                                    teller_id: req.user.teller_id,
                                    current_balance: account2.balance,
                                    availavble_balance: (parseInt(account2.balance) + parseInt(amount)),
                                    balance: (parseInt(account2.balance) + parseInt(amount)),
                                    self: false,
                                    firstname: account1.firstname,
                                    lastname: account1.lastname,
                                    phone_number: account1.phone_number,
                                    status: "success"
                                });
                                return res.render("transfer", {
                                    success,
                                    req
                                })
                            })
                        })
                    })
                })
            }
        })
    })
})

module.exports = router;