const router = require("express").Router();
const Account = require("../model/Account");
const History = require("../model/History");
const uuid = require("uuid").v4;


const sendEmail = require("../utils/sendMail");
const sendSMS = require("../utils/sendSMS");

const { ensureAuthenticated } = require('../config/auth');


// deposit

router.get("/", ensureAuthenticated, (req,res) => {
    Account.find({})
        .then(accounts => {
            res.render("deposit", {req, accounts});
        })
});

router.post("/", ensureAuthenticated, (req,res) => {
    const {firstname, lastname, amount, account_number, self, phone_number} = req.body;
    const errors = [];
    const success = [];

    if(!account_number || !amount){
        errors.push({msg:"please fill the amount and account number fields"})
    }

    if(isNaN(amount)){
        errors.push({msg: "please enter a numeric amount"})
    }

    if(isNaN(account_number) || account_number.length != 10){
        errors.push({"msg": "please enter a valid account number"});
    }

    if(errors.length > 0){
        return res.render("deposit", {
            req,
            errors,
            account_number,
            amount,
            firstname,
            lastname
        })
    }

    if(self === 'on'){

        Account.findOne({account_number}, (err, account) => {
            if(err) {
                console.log(err)
                errors.push({msg:"Internal error try again"});
            }

            if(!account){
                errors.push({msg:"No account matches account number"})
            }

            if(errors.length > 0){
                return res.render("deposit", {
                    req,
                    errors,
                    account_number,
                    amount,
                    firstname,
                    lastname
                })
            }

            // validation passed for self
            const current_balance = account.balance;

            // update istory
            const new_history = History({
                transaction_type: "credit",
                amount,
                credit: amount,
                debit: "",
                account_number,
                teller_id: req.user.teller_id,
                current_balance,
                description: `Deposit by ${lastname} ${firstname} - ${phone_number}`,
                balance: (parseInt(account.balance) + parseInt(amount)),
                available_balance: (parseInt(account.balance) + parseInt(amount)),
                self: true,
                status: "success",
                date: new Date()
            });

            new_history.save()
                .then(() => {
                    let account_history = account.history;
                    const new_account_history = {
                        id: uuid(),
                        transaction_type: "credit",
                        amount,
                        credit: amount,
                        debit: "",
                        account_number,
                        teller_id: req.user.teller_id,
                        current_balance,
                        description: "cash deposit",
                        balance: (parseInt(account.balance) + parseInt(amount)),
                        available_balance: (parseInt(account.balance) + parseInt(amount)),
                        self: true,
                        status: "success",
                        date: new Date()
                    };

                    account_history.push(new_account_history);
        
                    Account.findOneAndUpdate(
                        {account_number},
                        {$inc:{"balance": amount, "billing_balance": 3}, history: account_history}
                    )
                    .then(async () => {
                        await success.push({msg: "deposit successful"});
                        // send sms
                        sendSMS(account, amount, "transaction", new_account_history)
                        // send email
                        sendEmail(account, amount, "transaction", new_account_history);
                        return res.render("deposit", {
                            req,
                            success
                        });
                    })
                })
        })
    }else{
        Account.findOne({account_number}, (err, account) => {
            if(err) {
                console.log(err)
                errors.push({msg:"Internal error try again"});
            }

            // check for required fields
            if(!firstname || !lastname || !phone_number){
                errors.push({msg:"please enter first name, last name and phone number"});
            }

            if(errors.length > 0){
                return res.render("deposit", {
                    req,
                    errors,
                    account_number,
                    amount,
                    firstname,
                    lastname
                })
            }

            const current_balance = account.balance;

            // update istory
            const new_history = History({
                transaction_type: "credit",
                account,
                amount,
                credit: amount,
                debit: "",
                account_number,
                teller_id: req.user.teller_id,
                description: `Deposit by ${lastname} ${firstname} - ${phone_number}`,
                balance: (parseInt(account.balance) + parseInt(amount)),
                self: true,
                status: "success",
                phone_number,
                firstname,
                lastname
            });

            new_history.save()
                .then(() => {
                    const account_history = account.history;
                    const new_account_history = {
                        transaction_type: "credit",
                        id: uuid(),
                        amount,
                        credit: amount,
                        debit: "",
                        account_number,
                        teller_id: req.user.teller_id,
                        current_balance,
                        description: `Deposit by ${lastname} ${firstname} - ${phone_number}`,
                        balance: (parseInt(account.balance) + parseInt(amount)),
                        available_balance: (parseInt(account.balance) + parseInt(amount)),
                        self: false,
                        status: "success",
                        date: new Date(),
                        phone_number,
                        firstname,
                        lastname
                    };
        
                    account_history.push(new_account_history);
        
                    Account.findOneAndUpdate(
                        {account_number},
                        {$inc:{"balance": amount, "billing_balance": 3}, history: account_history}
                    )
                    .then(async () => {
                        await success.push({msg: "deposit successful"});
                        // send sms
                        sendSMS(account, amount, "transaction", new_account_history)
                        // send email
                        sendEmail(account, amount, "transaction", new_account_history);
                        return res.render("deposit", {
                            req,
                            success
                        });
                    })
                })
        })
    }
})

module.exports = router;