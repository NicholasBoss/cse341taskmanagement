const { body } = require('express-validator');

const projectValidationRules = () => [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('dueDateTime').optional().isISO8601().withMessage('Invalid date format'),
];

module.exports = { projectValidationRules };