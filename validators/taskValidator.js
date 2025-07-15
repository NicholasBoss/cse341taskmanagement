const { body } = require('express-validator');

const taskValidationRules = () => [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string'),

  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('dueDateTime')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
];

module.exports = { taskValidationRules };