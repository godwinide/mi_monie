const router = require("express").Router();
const Account = require("../model/Account");
const { ensureAuthenticated } = require('../config/auth');


router.get("/:account_number", ensureAuthenticated, (req,res) => {
    const account_number = req.params.account_number;

    Account.findOne({account_number}, (err, account) => {
        if(!account){
            return res.redirect("/");
        }
        else{
            return res.render("account/detail", {req, account});
        }
    })
})

module.exports = router;