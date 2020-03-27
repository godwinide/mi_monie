const router = require("express").Router();
const Account = require("../model/Account");
const { ensureAuthenticated } = require('../config/auth');


router.get("/", ensureAuthenticated, (req,res) => {
    Account.find({})
    .then(accounts => {
        res.render("accounts", {req, accounts})
    })
});



module.exports = router;