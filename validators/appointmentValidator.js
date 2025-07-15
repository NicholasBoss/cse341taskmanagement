const { body } = require('express-validator');

const appointmentValidationRules = () => [
  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isString().withMessage('User ID must be a string'),

  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),

  body('location')
    .notEmpty().withMessage('Location is required')
    .isString().withMessage('Location must be a string'),

  body('time')
    .notEmpty().withMessage('Time is required')
    .isISO8601().withMessage('Time must be a valid ISO date-time string'),
];

module.exports = { appointmentValidationRules };