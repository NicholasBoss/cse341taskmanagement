const { body } = require('express-validator');

const userValidationRules = () => [
  body('userName')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string'),

  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),

  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),

  body('city')
    .optional()
    .isString().withMessage('City must be a string'),

  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string'),

  body('gitHubUser')
    .optional()
    .isString().withMessage('GitHub username must be a string'),
];

module.exports = { userValidationRules };