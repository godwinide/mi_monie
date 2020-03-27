const router = require("express").Router();
const Account = require("../model/Account");

// @route - get info route
// @desc - get account info
// @access - admin private

router.post("/", (req,res) => {
    const {account_number} = req.body;

    console.log(req.body)

    Account.findOne({account_number}, (err, acc) => {
        if(err) console.log(err);

        if(acc){
            return res.json({
                firstname: acc.firstname,
                lastname: acc.lastname,
                account_number: acc.account_number
            })
        }else{
            res.status(404);
            return res.json({
                msg:"Account does not exist!"
            })
        }
    })

})

module.exports = router;