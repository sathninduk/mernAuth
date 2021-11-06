const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PaymentSchema = new Schema({
    course: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        required: true
    }
});

const Payments = mongoose.model("payments", PaymentSchema);
module.exports = Payments;