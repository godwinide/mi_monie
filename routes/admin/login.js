const express = require('express');
const router = express.Router();
const passport = require('passport');
const { forwardAuthenticated } = require('../../config/auth');


router.get("/", (req,res) => {
    res.render("admin/login", {req});
});


// Login
router.post('/', forwardAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
});


// Logout
router.post('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/admin/login');
});






module.exports = router;