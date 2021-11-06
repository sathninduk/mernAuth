const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLessonEditInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.lesson = !isEmpty(data.lesson) ? data.lesson : "";

    // Name checks
    if (Validator.isEmpty(data.lesson)) {
        errors.lesson = "Lesson Name is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
