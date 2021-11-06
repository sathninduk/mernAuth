const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    zoom: {
        type: String,
        required: false
    },
    zoomStart: {
        type: Date,
        required: false
    },
    zoomEnd: {
        type: Date,
        required: false
    },
    onDemand: {
        type: Number,
        required: true,
        default: 1
    },
    status: {
        type: Number,
        required: true,
        default: 0
    }
});

const Courses = mongoose.model("courses", CourseSchema);
module.exports = Courses;