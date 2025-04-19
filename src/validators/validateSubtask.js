const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateSubtask = [
  // Validate title
  body('title')
    .notEmpty().withMessage('Subtask title is required')
    .isLength({ min: 1 }).withMessage('Title must be at least 1 character long')
    .trim(),

  // Validate task reference
  body('task')
    .notEmpty().withMessage('Task reference is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Task must be a valid MongoDB ObjectId'),

  // Optional: validate completed (boolean)
  body('completed')
    .optional()
    .isBoolean().withMessage('Completed must be true or false'),

  // Validate createdBy reference
  body('createdBy')
    .notEmpty().withMessage('CreatedBy field is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('createdBy must be a valid MongoDB ObjectId'),

  // Handle validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateSubtask;
