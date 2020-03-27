const router = require("express").Router();
const { ensureAuthenticated } = require('../../config/auth');


router.get("/", ensureAuthenticated, (req,res) => {
    res.render("admin/send_sms", {req});
})


module.exports = router;