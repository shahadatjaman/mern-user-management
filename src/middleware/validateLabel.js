const { body, validationResult } = require('express-validator');

const validateLabel = [
  body('name')
    .notEmpty().withMessage('Label name is required')
    .isLength({ min: 1 }).withMessage('Label name must be at least 1 character long'),

  body('color')
    .optional()
    .matches(/^#([0-9A-F]{3}){1,2}$/i).withMessage('Color must be a valid HEX code'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateLabel;
