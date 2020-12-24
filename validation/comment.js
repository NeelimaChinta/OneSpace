const validator = require ("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ?data.text :"";
    data.name = !isEmpty(data.name) ? data.name : "";

    if (validator.isEmpty(data.text)) {
        errors.text = "Text field is required.";
    }  

    if (validator.isLength(data.text, {min: 30, max: 300})) {
        errors.text = "Text field must be between 30 and 300 characters"
    }
    

    if (validator.isEmpty(data.name)) {
        errors.name = "Name field is required.";
    }

    return {
        errors,
        isValid : isEmpty(errors)
    };
};