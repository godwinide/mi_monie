const router = require("express").Router();
const $ = require("cheerio");
const rp = require("request-promise");

router.get("/", async (req,res) => {
    const url = "https://covid19.ncdc.gov.ng";

    const html = await rp.get(url);

    const data = {
        summary:{
            confirmed_cases:"",
            active:"",
            discharged:"",
            death:""
        },
        datasets:[]
    };

    function purify(arr){
        const pure = arr.filter(e => e !== "");
        // find akwa ibom
        if(pure.length > 5){
            const sname = pure.splice(1,1);
            pure[0] = pure[0] + " " + sname;
            return pure;
        }
        return pure;
    };

    const summary = ($(".col-xs-3", html).text().trim().split(/\n/).filter(e => e !== ""));

    data.summary.confirmed_cases = parseInt(summary[1].replace(/,/g, ""));
    data.summary.active = parseInt(summary[3].replace(/,/g, ""));
    data.summary.discharged = parseInt(summary[5].replace(/,/g, ""));
    data.summary.death = parseInt(summary[7].replace(/,/g, ""));


    const raw_datasets = ($("table#custom1 tbody td", html).text().trim().split(/\s\n/g).
        map((e => e.replace(/\n/g, " ").split(" "))));
        
    raw_datasets.forEach(e => data.datasets.push(purify(e)));


    res.render("covid19", {req, data})
});

module.exports = router;