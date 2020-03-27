const router = require("express").Router();
const Admin = require("../../model/Admin");
const bcrypt = require("bcryptjs");

const { ensureAuthenticated } = require('../../config/auth');


router.get("/:id", ensureAuthenticated, (req, res) => {
    const id = req.params.id;

    if(!id){
        res.redirect("/");
    }

    Admin.findOne({_id:id}, (err, admin) => {
        return res.render("admin/modify", {
            req,
            id: admin.id,
            teller_id: admin.teller_id,
            username: admin.username
        })
    })
})


router.post("/", ensureAuthenticated, (req,res) => {
    const errors = [];
    const success = [];

    const {
        id,
        username,
        password,
        password2
        } = req.body;

    if(!username ){
        errors.push({msg: "please enter a username"})
    }


    if(errors.length > 0){
        return res.render("admin/modify", {
            req,
            id,
            username,
            password,
            password2
        })
    }

    if(password.length > 4 && password === password2){
        bcrypt.genSalt(10, (err, salt) => {
            if(err) throw(err)
            bcrypt.hash(String(password), salt, (err, hash) => {
                if(err) throw(err);

                Admin.findOneAndUpdate({_id:id},{
                    username,
                    password: hash
                })
                .then(async acc => {
                    await success.push({msg: "Admin Updated"});
                    return res.render("admin/modify", {success, id, req});
                })

            })
        })
    }


    Admin.findOneAndUpdate({_id:id},{
        username
    })
    .then(async acc => {
        await success.push({msg: "Admin Updated"});
        return res.render("admin/modify", {success, id, req});
    })
});



module.exports = router;