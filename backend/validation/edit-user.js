const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.name = !isEmpty(data.name) ? data.name : "";
    data.tel = !isEmpty(data.tel) ? data.tel : "";

    // Name checks
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    // Tel checks
    if (Validator.isEmpty(data.tel)) {
        errors.tel = "Contact number is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
