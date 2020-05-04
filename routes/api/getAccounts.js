const router = require("express").Router()
const Account = require("../../model/Account");

router.get("/", (req,res) => {
    const response = [];

    Account.find({})
        .then(accounts => {
            accounts.forEach(e => {
                account_name = `${e.lastname} ${e.firstname}`;
                if (e.middlename !== 'undefined' || e.middlename !== ""){
                    account_name += ` ${e.middlename}`;
                    response.push({
                        account_number: e.account_number,
                        account_name,
                        account_balance: e.balance,
                        last_transaction: e.history[e.history.length-1]
                    });
                }
            })
        }).then(()=> {
            res.json(response);
        })
})

module.exports = router;