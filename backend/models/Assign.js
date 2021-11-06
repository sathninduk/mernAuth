const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AssignSchema = new Schema({
    course: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 1
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Assign = mongoose.model("assign", AssignSchema);
module.exports = Assign;