const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LessonsSchema = new Schema({
    lesson: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Lessons = mongoose.model("lessons", LessonsSchema);
module.exports = Lessons;