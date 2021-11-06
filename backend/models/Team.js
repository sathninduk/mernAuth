const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TeamSchema = new Schema({
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
    },
    file: {
        type: String,
        required: true
    }
});

const Team = mongoose.model("team", TeamSchema);
module.exports = Team;