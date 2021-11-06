const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ForgotSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date(),
        required: true
    }
});

const Forgot = mongoose.model("forgot", ForgotSchema);
module.exports = Forgot;