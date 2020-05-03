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


    // deposits

    function doDeposit(){
        return new Promise((resolve, reject) => {
            deposits.forEach((e, index, arr) => {
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

                if(index == arr.length-1){
                    console.log("breakpoint1")
                    resolve("done")
                }
            });
        })
    }

    function doWithDraw(){
        // withdraws
        return new Promise((resolve, reject) => {
            withdraws.forEach((e, index, arr) => {
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

                if(index == arr.length-1){
                    console.log("breakpoint2")
                    resolve("done")
                }
            });
        })
    }

    // transfers
    function doTransfer(){
        return new Promise((resolve,reject) => {
            transfers.forEach((e, index, arr) => {
                const date = new Date();
                const today = new Date(`${date.getMonth()} ${date.getDay()} ${date.getFullYear()}`);
                const trans_date = new Date(`${e.date}`);
                if(trans_date >= today){
                    data.transfer.count++;
                    data.transfer.total_today += e.amount;
                }

                if(index == arr.length-1){
                    console.log("breakpoint3")
                    resolve("done")
                }
            });
        })
    }

        doWithDraw()
        .then(()=> {
            console.log("breakpoint4")
            doDeposit()
            .then(() => {
                console.log("breakpoint5")
                doTransfer()
                .then(() => {
                    console.log("breakpoint6")
                    const {withdraw, deposit} = data;
                    data.available.balance = deposit.total - withdraw.total;
                })
                .then((data)=> {
                    console.log("done")
                    const {withdraw:withdraws, transfer:transfers, deposit:deposits, available} = data;
                    setTimeout(()=> res.render("dashboard", {req, withdraws, transfers, deposits, history, available}),0)
                })
            })
        })


});

module.exports = router;