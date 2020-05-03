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


    Promise.all(deposits, withdraws, transfers, history)
        .then((deposits, withdraws, transfers, history) => {
                    // deposits
            const rd = deposits.forEach(e => {
                const date = new Date();
                const today = new Date(`${date.getMonth()} ${date.getDay()} ${date.getFullYear()}`);
                const trans_date = new Date(`${e.date}`);
                if(trans_date >= today){
                    data.deposit.count++;
                    data.deposit.total_today += e.amount;
                    data.deposit.total += e.amount;
                }else{
                    data.deposit.total += e.amount
                }
            });

            // withdraws
            const rw = withdraws.forEach(e => {
                const date = new Date();
                const today = new Date(`${date.getMonth()} ${date.getDay()} ${date.getFullYear()}`);
                const trans_date = new Date(`${e.date}`);
                if(trans_date >= today){
                    data.withdraw.count++;
                    data.withdraw.total_today += e.amount;
                    data.withdraw.total += e.amount;
                }else{
                    data.withdraw.total += e.amount
                }
            });

            // transfers
            const rt = transfers.forEach(e => {
                const date = new Date();
                const today = new Date(`${date.getMonth()} ${date.getDay()} ${date.getFullYear()}`);
                const trans_date = new Date(`${e.date}`);
                if(trans_date >= today){
                    data.transfer.count++;
                    data.transfer.total_today += e.amount;
                }
            });
        })
        .then(()=> {
                const {withdraw, deposit} = data;
                data.available.balance = deposit.total - withdraw.total;
                const {withdraw:withdraws, transfer:transfers, deposit:deposits, available} = data;
                res.render("dashboard", {req, withdraws, transfers, deposits, history, available})
        })

});

module.exports = router;