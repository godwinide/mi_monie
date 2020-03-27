const router = require("express").Router();
const Admin = require("../../model/Admin");
const { ensureAuthenticated } = require('../../config/auth');

router.get("/", ensureAuthenticated, async (req,res) => {
    const accounts = await Admin.find({});
    res.render("admin/admin", {req, accounts});
})

module.exports = router;