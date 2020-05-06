const express = require('express');
const app = express();
const expressLayouts = require("express-ejs-layouts");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');


// connect db
require("./db/connectDB");

// Passport Config
require('./config/passport')(passport);


// ejs
app.use(expressLayouts);
app.set("view engine", 'ejs');


// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
  

  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

// static pat
app.use(express.static("./public"));

// Routes

// covid19
app.use("/covid19", require("./routes/covid19"));

// admin routes
app.use("/admin", require("./routes/admin/admin"));
app.use("/admin/login", require("./routes/admin/login"));
app.use("/admin/register", require("./routes/admin/register"));
app.use("/admin/modify", require("./routes/admin/modify"));
app.use("/admin/detail", require("./routes/admin/detail"));
app.use("/admin/send_email", require("./routes/admin/send_email"));
app.use("/admin/send_sms", require("./routes/admin/send_sms"));
app.use("/admin/billing", require("./routes/admin/billing"));

//account routes
app.use("/", require("./routes/index"));
app.use("/accounts", require("./routes/accounts"));
app.use("/details", require("./routes/account_details"));
app.use("/register", require("./routes/register"));
app.use("/modify", require("./routes/modify"));
app.use("/delete", require("./routes/deleteAccount"));

//printing
app.use("/print_account", require("./routes/print_account"));
app.use("/print_history", require("./routes/print_history"));

app.use("/auth", require("./routes/auth"));

//transaction routes
app.use("/deposit", require("./routes/deposit"));
app.use("/withdraw", require("./routes/withdraw"));
app.use("/transfer", require("./routes/transfer"));

// API routes
app.use("/api/getAccounts", require("./routes/api/getAccounts"))

const PORT = process.env.PORT || 2020;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
