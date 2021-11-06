const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const TopicsSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
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
    video: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

const Topics = mongoose.model("topics", TopicsSchema);
module.exports = Topics;