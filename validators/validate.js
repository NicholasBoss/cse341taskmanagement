const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = errors.array().map(err => ({
        field: err.param,
        message: err.msg
    }));

    return res.status(400).json({
        message: 'Validation failed',
        errors: extractedErrors
    });
};

module.exports = { validate };
