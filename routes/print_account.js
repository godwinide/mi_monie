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
            return res.redirect("/")
        }
        else{ 
            const pdf = {
                account_info: {
                    name: `${account.lastname} ${account.firstname} ${account.middlename ? account.middlename : ""}`,
                    account
                }
            }

            
            await createAccountPDF(pdf.account_info, `./${pdf.account_info.account.account_number}.pdf`);
            const file = await fs.createReadStream(`./${pdf.account_info.account.account_number}.pdf`);
            await file.pipe(res);
            setTimeout(()=> fs.unlinkSync(`./${pdf.account_info.account.account_number}.pdf`),2000)
        }
    })
})


module.exports = router;