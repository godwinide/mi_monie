const router = require("express").Router();

// @route - login route
// @desc - log user in
// @access - admin private

router.post("/login", (req,res) => {
    res.json({msg: "route is working!"})
})

module.exports = router;