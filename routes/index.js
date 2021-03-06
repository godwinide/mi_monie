const router = require("express").Router();
const Account = require("../model/Account");

const History = require("../model/History");

const { ensureAuthenticated } = require('../config/auth');


router.get("/", ensureAuthenticated, async (req,res) => {
    const data = {
        deposit:{
            total_today: 0,
            total:0,
            count: 0
        },
        withdraw:{
            total_today: 0,
            total: 0,
            count: 0
        },
        transfer:{
            total_today: 0,
            count: 0
        },
        available: {
            balance: 0
        }
    }

    const deposits = await History.find({transaction_type:"credit", status:"success"});
    const withdraws = await History.find({transaction_type: "debit", status: "success"});
    const transfers = await History.find({type: "transfer", status: "success"});
    const history = await History.find({status: "success"}).sort({date: -1}).limit(10);
    const accounts = await Account.find({balance:{$gt:0}});


    // deposits
    const rd = deposits.forEach(e => {
        data.deposit.count++;
        data.deposit.total_today += e.amount;
        data.deposit.total += e.amount;
        
    });

    // withdraws
    const rw = withdraws.forEach(e => {
        data.withdraw.count++;
        data.withdraw.total_today += e.amount;
        data.withdraw.total += e.amount;
    });

    // transfers
    const rt = transfers.forEach(e => {
        data.transfer.count++;
        data.transfer.total_today += e.amount;
    });


    const at = accounts.forEach(e => {
        data.available.balance += e.balance;
    })

    Promise.all([rd,rw,rt,at])
        .then(()=> {
            const {withdraw:withdraws, transfer:transfers, deposit:deposits, available} = data;
            setTimeout(()=> res.render("admin/_dashboard", {req, withdraws, transfers, deposits, history, available}),0)
        })
});

module.exports = router;