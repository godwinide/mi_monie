const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
    transaction_type: {
        type: String,
        required: true
    },
    type:{
        type: String,
        required: false,
        default: ""
    },
    amount:{
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    account_number:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: false,
        default: Date.now
    },
    status:{
        type: String,
        required: true
    },
    teller_id:{
        type: Number,
        required: true
    },
    self: {
        type: Boolean,
        default: true
    },
    firstname:{
        type: String,
        required: false
    },
    lastname:{
        type: String,
        required: false
    },
    phone_number:{
        type: String,
        required: false
    }
});

module.exports = History = mongoose.model("History", historySchema);