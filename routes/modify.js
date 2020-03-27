const router = require("express").Router();
const Account = require("../model/Account");
const bcrypt = require("bcryptjs");

const { ensureAuthenticated } = require('../config/auth');


router.get("/:account_number", ensureAuthenticated, (req, res) => {
    const account_number = req.params.account_number;

    if(!account_number){
        res.redirect("/");
    }

    Account.findOne({account_number}, (err, account) => {
        return res.render("account/modify", {
            req,
            firstname: account.firstname,
            lastname: account.lastname,
            middlename: account.middlename,
            address1: account.address1,
            address2: account.address2,
            email: account.email,
            account_number: account.account_number,
            phone_number:account.phone_number
        })
    })
})


router.post("/", ensureAuthenticated, (req,res) => {
    const errors = [];
    const success = [];

    const {
        account_number,
        firstname,
        lastname,
        middlename,
        email,
        phone_number,
        address1,
        address2,
        bvn,
        pin1,
        pin2
        } = req.body;

    if(!firstname || !lastname ){
        errors.push({msg: "please fill all fields"})
    }


    if(errors.length > 0){
        return res.render("account/modify", {
            req,
            errors,
            account_number,
            firstname,
            lastname,
            middlename,
            email,
            phone_number,
            pin1,
            bvn,
            pin2
        })
    }





    if(pin1.length == 5 && pin1 === pin2){
        bcrypt.genSalt(10, (err, salt) => {
            if(err) throw(err)
            bcrypt.hash(String(pin2), salt, (err, hash) => {
                if(err) throw(err);

                Account.findOneAndUpdate({account_number},{
                    firstname,
                    lastname,
                    middlename,
                    email,
                    phone_number,
                    address1,
                    bvn,
                    address2,
                    pin: hash
                })
                .then(async acc => {
                    await success.push({msg: "Account Updated"});
                    return res.render("account/modify", {success, account_number, req});
                })

            })
        })
    }


    Account.findOneAndUpdate({account_number},{
        firstname,
        lastname,
        middlename,
        email,
        bvn,
        phone_number,
        address1,
        address2
    })
    .then(async acc => {
        console.log(acc)
        await success.push({msg: "Account Updated"});
        return res.render("account/modify", {success, account_number, req});
    })
});



module.exports = router;