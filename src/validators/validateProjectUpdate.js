// middleware/validateProjectUpdate.js
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const validateProjectUpdate = [
  // 'name' is optional but must be valid if provided
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Project name must be at least 3 characters long'),

  // 'description' is optional
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot be longer than 500 characters'),

  // 'owner' is optional but must be valid if provided
  body('owner')
    .optional()
    .isMongoId().withMessage('Owner must be a valid MongoDB ObjectId'),

  // 'team' is optional, must be array of valid ObjectIds
  body('team')
    .optional()
    .isArray().withMessage('Team must be an array of user IDs')
    .custom((value) => {
      return value.every((id) => mongoose.Types.ObjectId.isValid(id));
    }).withMessage('Each team member must be a valid MongoDB ObjectId'),

  // 'status' validation
  body('status')
    .optional()
    .isIn(['active', 'archived', 'completed']).withMessage('Status must be one of: active, archived, or completed'),

  // 'priority' validation
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be one of: low, medium, or high'),

  // 'startDate' validation
  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid ISO date'),

  // 'dueDate' validation
  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid ISO date'),

  // Final middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateProjectUpdate;
