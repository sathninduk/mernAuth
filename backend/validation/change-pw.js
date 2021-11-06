const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.curPassword = !isEmpty(data.curPassword) ? data.curPassword : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : "";

    // Password checks
    if (Validator.isEmpty(data.curPassword)) {
        errors.curPassword = "Password field is required";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (Validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "Confirm password field is required";
    }

    if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!Validator.isLength(data.password, { max: 30 })) {
        errors.password = "Password must be less than 30 characters";
    }

    if (!Validator.equals(data.password, data.confirmPassword)) {
        errors.confirmPassword = "Passwords must match";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
