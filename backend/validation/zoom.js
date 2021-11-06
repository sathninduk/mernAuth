const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateZoomInput(data) {
    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.link = !isEmpty(data.link) ? data.link : "";
    data.start = !isEmpty(data.start) ? data.start : "";
    data.fee = !isEmpty(data.fee) ? data.fee : "";

    console.log(data.start)

    // Link checks
    if (Validator.isEmpty(data.link)) {
        errors.link = "Link field is required";
    }

    // Start checks
    if (Validator.isEmpty(data.start)) {
        errors.start = "Start field is required";
    }

    // End checks
    if (Validator.isEmpty(data.end)) {
        errors.end = "End field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};
