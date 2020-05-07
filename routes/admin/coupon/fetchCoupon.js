const router = require("express").Router();
const { ensureAuthenticated } = require('../../../config/auth');
const rp = require("request-promise");
const $ = require("cheerio");
const fs = require("fs");

router.get("/", ensureAuthenticated, async (req,res) => {
    res.render("coupon/fetchCoupon", {req});
});

router.post("/", (req,res) => {
    const errors = [];
    const {date, source, url} = req.body;
    
    function returnError(err){
        errors.push(err);
        return res.render("coupon/fetchCoupon", {req, errors});
    }
    
    async function handleTriple(furl){
        if(furl.length < 10){
            returnError({msg:"Please enter url for triple page :("});
        }

        const url = furl;
        const response = await rp.get(url);
        const html = $.parseHTML(response);
        const table = $("#table", html);
        res.render("coupon/results", {req, table, source:"Triple"});
    }

    async function handleAblefast(date){
        // validation
        if(!date || !source){
            returnError({msg: "Please Fill the required fields :("});
        };
        // validation passed

        const url = `https://ablefast.com/result/${date}`;
        const response = await rp.get(url);
        const html = $.parseHTML(response);
        const table = $("#table", html);
        res.render("coupon/results", {req, table, source:"Able Fast"});
    }


    switch(source){
        case  "ablefast":
            handleAblefast(date);
            break;
        case "triple":
            handleTriple(url);
            break;
        default: 
            returnError({msg: "Something went wrong :("})
            break;
    }

})

module.exports = router;