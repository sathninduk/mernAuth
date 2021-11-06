const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLessonAddInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.lesson = !isEmpty(data.lesson) ? data.lesson : "";
    data.position = !isEmpty(data.position) ? data.position : "";

    // Name checks
    if (Validator.isEmpty(data.lesson)) {
        errors.lesson = "Lesson Name is required";
    }

    // Position checks
    if (Validator.isEmpty(data.position)) {
        errors.position = "Position field is required";
    } else if (!Validator.isNumeric(data.position)) {
        errors.position = "Invalid position, Please try again"
    } else if (data.position < 0) {
        errors.position = "Invalid position, Please try again"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
