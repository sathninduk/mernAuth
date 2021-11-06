const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCourseAddInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.course = !isEmpty(data.course) ? data.course : "";

    // Course checks
    if (Validator.isEmpty(data.course)) {
        errors.course = "Course field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
