const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    teller_id: {
        type: Number,
        required: true
    },
    super:{
        type: Boolean,
        required: false,
        default: false
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = Admin = mongoose.model("Admin", adminSchema);