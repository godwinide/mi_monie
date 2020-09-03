const router = require("express").Router();
const historyPDF = require("../utils/createHistoryPDF");
const fs = require("fs")

const { ensureAuthenticated } = require('../config/auth');


const Account = require("../model/Account");

router.get("/:account_number", ensureAuthenticated, async (req,res) => {
    const {account_number} = req.params;


    if(!account_number){
        return res.redirect("/")
    }

    Account.findOne({account_number}, async (err, account) => {
        if(!account){
            return res.redirect("/")
        }
        else{ 

            historyPDF(account, res);
        }
    })
  
})


module.exports = router;