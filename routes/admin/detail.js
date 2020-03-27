const router = require("express").Router();
const Admin = require("../../model/Admin");
const History = require("../../model/History");
const { ensureAuthenticated } = require('../../config/auth');


router.get("/:id", ensureAuthenticated, async (req,res) => {
    const id = req.params.id;

    Admin.findOne({_id:id}, async (err, admin) => {
        if(!admin){
            return res.redirect("/");
        }
        else{
            history = await History.find({teller_id: admin.teller_id}).sort({date: -1})
            
            return res.render("admin/detail", {req, admin, history});
        }
    })
})

module.exports = router;