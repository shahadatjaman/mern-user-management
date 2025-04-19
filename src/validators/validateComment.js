const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateComment = [
  // Validate task ID
  body('task')
    .notEmpty().withMessage('Task ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Task ID must be a valid MongoDB ObjectId'),

  // Validate author ID
  body('author')
    .notEmpty().withMessage('Author ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Author ID must be a valid MongoDB ObjectId'),

  // Validate content
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),

  // Final error checker
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateComment;
