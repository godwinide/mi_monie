const router = require("express").Router();
const { createAccountPDF } = require("../utils/createIAccountPDF");
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
            return res.redirect("/");
        }
        else{ 
            Account.findOneAndDelete({account_number}, (err => {
                if(err) console.log(err);
                res.redirect("/");
            }))
        }
    })
})


module.exports = router;