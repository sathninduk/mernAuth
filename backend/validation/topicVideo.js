const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateTopicVideoInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.video = !isEmpty(data.video) ? data.video : "";

    // Name checks
    if (Validator.isEmpty(data.video)) {
        errors.video = "Video URL is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
