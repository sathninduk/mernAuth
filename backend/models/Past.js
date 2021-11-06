const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PastSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

const Past = mongoose.model("past", PastSchema);
module.exports = Past;