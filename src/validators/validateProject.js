const { body, validationResult } = require('express-validator');

const validateProject = [
  // Validate 'name' field
  body('name')
    .notEmpty().withMessage('Project name is required')
    .trim()
    .isLength({ min: 3 }).withMessage('Project name must be at least 3 characters long'),
  
  // Validate 'description' field
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot be longer than 500 characters'),
  
  // Validate 'owner' field (ensure it's a valid ObjectId)
  body('owner')
    .notEmpty().withMessage('Owner is required')
    .isMongoId().withMessage('Owner must be a valid MongoDB ObjectId'),

  // Validate 'team' field (ensure all members are valid ObjectIds)
  body('team')
    .optional()
    .isArray().withMessage('Team must be an array of users')
    .custom((value) => {
      return value.every((id) => mongoose.Types.ObjectId.isValid(id));  // Check if all team members are valid MongoDB ObjectIds
    }).withMessage('Each team member must be a valid MongoDB ObjectId'),

  // Validate 'status' field
  body('status')
    .optional()
    .isIn(['active', 'archived', 'completed']).withMessage('Status must be one of: active, archived, or completed'),

  // Validate 'priority' field
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high']).withMessage('Priority must be one of: low, medium, or high'),

  // Validate 'startDate' and 'dueDate' fields (optional, but if provided must be valid dates)
  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due date must be a valid date'),

  // Custom middleware to check validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateProject;
