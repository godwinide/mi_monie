const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Account = require("../model/Account");
const utils = require("../utils/utils");
const sendMail = require("../utils/sendMail");
const sendSMS = require("../utils/sendSMS");

const { ensureAuthenticated } = require('../config/auth');


// @route - register route
// @desc - resgister user
// @access - admin private

router.get("/account", ensureAuthenticated, (req,res) => {
    res.render("register", {req});
})

router.post("/account", ensureAuthenticated, async (req,res) => {
    const {
        firstname,
        lastname,
        middlename,
        phone_number,
        email, 
        address1,
        address2,
        pin1,
        pin2,
        city,
        state,
        gender,
        balance,
        bvn,
        dob
        } = req.body;


    const errors = [];

    // validate required fileds
    if(!firstname || !dob || !lastname || !phone_number || !email || !address1 || !pin1 || !pin2 ){
        errors.push({msg:"Please enter all required fields!"})
    }

    // validate pin
    if(pin1 !== pin2){
        errors.push({msg: "Pins do not match"});
    }

    if(isNaN(parseInt(pin2)) || pin2.length !== 5){
        errors.push({msg: "Please enter a 5 digit pin!"});
    }

    // check if errors exist
    if(errors.length > 0){
        return res.render("register",{
            req,
            errors,
            firstname,
            lastname,
            middlename,
            phone_number,
            email, 
            address1,
            address2,
            pin1,
            pin2,
            city,
            state,
            bvn,
            balance
        })
    }else{

    // generate account number
    const account_number = utils.accNumGen(7);
    // check if account number exists
    Account.findOne({account_number}, async (err, exists) => {
        if(err) console.log(err)
        if(exists){
            errors.clear();
            errors.push({msg: "internal error try again!"});
            return res.render("register", {
                req,
                errors,
                errors,
                firstname,
                lastname,
                middlename,
                phone_number,
                email, 
                address1,
                address2,
                pin1,
                pin2,
                city,
                bvn,
                state,
                balance
            })
        }else{
            // validation passed
            // create user
            const newAccount = new Account({
                firstname,
                lastname,
                middlename,
                phone_number,
                email, 
                address1,
                address2,
                dob,
                bvn,
                gender,
                password: pin2,
                user_id:null,
                account_number,
                city,
                state,
                bvn,
                balance
            })

            // hash password
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.log(err);
                bcrypt.hash(newAccount.password, salt, (err, hash) => {
                    newAccount.password = hash;
                    // set account passport
                    if(isNaN(balance)){
                        newAccount.balance = 0
                    };
                    Account.countDocuments().then(num => {
                    newAccount.user_id = utils.paddNum(String(num));
                    }).then(()=> {
                        // save user
                        newAccount.save()
                        .then((account) => {
                            // send sms
                            sendSMS(account, null, "welcome_sms", {}, pin);
                            sendMail(account, null, "welcome_email", {});
                            return res.render("success_views/reg_success",{
                                req,
                                account_number: newAccount.account_number,
                                user_id: newAccount.user_id,
                                pin: pin2,
                                email
                            }) 
                        })
                    })
                    })
            })
        }
    })
}
})

module.exports = router;