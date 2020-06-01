const router = require("express").Router();
const Account = require("../../model/Account");
const History = require("../../model/History");
const sendEmail = require("../../utils/sendMail");
const { ensureAuthenticated } = require('../../config/auth');
const sendSMS = require("../../utils/sendSMS");



router.get("/", ensureAuthenticated, async (req,res) => {
    let total_bills = 0;
    const accounts = await Account.find({});
    await accounts.forEach(account => {
        total_bills += account.billing_balance
    });
    res.render("admin/charge_accounts", {req, accounts, total_bills})
});

router.post("/", ensureAuthenticated, async (req,res) => {
    const errors = [];
    const success = [];

    const accounts = await Account.find({}) 

    accounts.forEach(account => {

            const old_history = account.history;

            const new_history = {
                transaction_type: "debit",
                amount: account.billing_balance,
                credit: "",
                debit: account.billing_balance,
                account_number: account.account_number,
                teller_id: req.user.teller_id,
                description: "SMS alert charges",
                current_balance: account.balance,
                available_balance: account.balance - account.billing_balance,
                balance: account.balance - account.billing_balance,
                self: false,
                date: new Date(),
                status: "success"
            }

            const new_gen_history = new History(new_history);

            old_history.push(new_history);

            Account.findOneAndUpdate({_id:account.id}, {
                balance: account.balance - (account.billing_balance + 3),
                billing_balance: 0,
                history: old_history
            })
            .then(()=> {
                new_gen_history.save();
                sendSMS(account, amount, "transaction", new_history);
            })
            .then(account => {
                sendEmail(account, new_history.amount, "transaction", new_history)
            })
            .catch(err => console.log(err))
    })


    success.push({msg: "All accounts have been billed"})
    res.redirect("/admin/billing")
});



module.exports = router;