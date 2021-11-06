const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateTopicEditInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.topic = !isEmpty(data.topic) ? data.topic : "";
    data.video = !isEmpty(data.video) ? data.video : "";

    // Name checks
    if (Validator.isEmpty(data.topic)) {
        errors.topic = "Topic Name is required";
    }

    // Name checks
    if (Validator.isEmpty(data.video)) {
        errors.video = "Video URL is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
