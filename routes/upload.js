const router = require("express").Router();
const multer = require('multer');
const sharp = require('sharp');
const storage = require('../utils/upload-config');

const Account = require("../model/Account");

const { ensureAuthenticated } = require('../config/auth');



const upload = multer(storage)
const path = require('path')
const fs = require('fs')

router.get('/:account_number', ensureAuthenticated, (req, res) => {
    const {account_number} = req.params;

    if(!account_number){
        res.redirect("/");
    }
    Account.findOne({account_number}, (err, account) => {
        if(!account){
            res.redirect("/")
        }else{
            res.render("account/upload", {account_number, req});
        }
    })
});

router.post('/', upload.single('image'), ensureAuthenticated, async (req, res) => {
    const errors = [];
    const success = [];

    const {account_number} = req.body;

    const { filename: image } = req.file;


    if(!req.file){
        errors.push({msg: "please upload an image"})
    }

    if(errors.length > 0){
        return res.render("account/upload", {account_number, errors, req});
    }else{

        Account.findOne({account_number}, async (err, account) => {
            if(!account){
                await errors.push({msg: "something went wrong"});
                return res.render("account/upload", {account_number, errors, req});
            }

            await sharp(req.file.path)
            .resize(500)
            .jpeg({quality: 50})
            .toFile(
                path.resolve(req.file.destination,`${account_number}.jpg`)
            )
            fs.unlinkSync(req.file.path);

            await Account.updateOne({account_number},{passport: true});
            await success.push({msg: "passport uploaded"});
            return res.render("account/upload", {success, account_number, req});
        })

    }
})

module.exports = router;