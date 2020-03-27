const mongoose = require("mongoose");
const db = require("../config/keys").mongoURI;

mongoose
.connect(db, {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=> {
    console.log("mongodb connected");
})
.catch(err => console.log(err));