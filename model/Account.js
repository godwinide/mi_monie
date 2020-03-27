const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    firstname:{
        type: String,
        min: 3,
        max: 20,
        required: true
    },
    lastname:{
        type: String,
        min: 3,
        max: 20,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    middlename:{
        type: String,
        min: 3,
        max: 20,
        required: false
    },
    user_id:{
        type: String,
        min: 5,
        max: 20,
        required: true
    },
    bvn:{
        type: Number,
        required: false
    },
    address1:{
        type: String,
        required: true
    },
    address2:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    phone_number:{
        type: String,
        required: true
    },
    account_number:{
        type: String,
        min: 11,
        max: 11,
        required: true
    },
    billing_balance:{
        type: Number,
        required: false,
        default: 0
    },
    password:{
        type: String,
        required: true
    },
    dob:{
        type: Date,
        required: true
    },
    passport:{
        type: Boolean,
        default: false,
        required: false
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "active"
    },
    balance:{
        type: Number,
        default: 0
    },
    history:{
        type: Array,
        default: []
    }
});

module.exports = Account = mongoose.model("Account", accountSchema);