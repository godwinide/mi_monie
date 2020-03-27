const router = require("express").Router();
const bcrypt = require('bcryptjs');
// Load Admin model
const Admin = require('../../model/Admin');
const { ensureAuthenticated, forwardAuthenticated } = require('../../config/auth');

router.get("/", ensureAuthenticated, (req,res) => {
    res.render("admin/register", {req});
});


router.post("/", ensureAuthenticated, (req, res) => {
  const { username, password, password2 } = req.body;
  const errors = [];
  const success = [];

  if (!username || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('admin/register', {
      req,
      errors,
      username,
      password,
      password2
    });
  } else {
    Admin.findOne({ username:username }).then(user => {
      if (user) {
        errors.push({ msg: 'username already exists' });
        res.render('admin/register', {
          req,
          errors,
          username,
          password,
          password2
        });
      } else {
        const newUser = new Admin({
          username,
          password,
          teller_id: Number(String(Math.random()).slice(2))
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(async user => {
                success.push({msg:"Admin registered"});
                res.render('admin/register', {req,success});
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
})


module.exports = router;