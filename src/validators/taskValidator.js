const { body } = require('express-validator');
const mongoose = require('mongoose');

const isValidObjectId = (value, { req, location, path }) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ObjectId in '${path}'`);
  }
  return true;
};

exports.createTaskValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .trim(),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('project')
    .notEmpty().withMessage('Project ID is required')
    .custom(isValidObjectId),

  body('assignedTo')
    .optional()
    .custom(isValidObjectId),

  body('status')
    .optional()
    .isIn(['todo', 'in-progress', 'done', 'blocked'])
    .withMessage("Status must be one of: 'todo', 'in-progress', 'done', 'blocked'"),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage("Priority must be one of: 'low', 'medium', 'high'"),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Due Date must be a valid ISO8601 date'),

  body('labels')
    .optional()
    .isArray().withMessage('Labels must be an array of strings')
    .custom((arr) => arr.every((label) => typeof label === 'string'))
    .withMessage('Each label must be a string'),

  body('attachments')
    .optional()
    .isArray().withMessage('Attachments must be an array of strings')
    .custom((arr) => arr.every((url) => typeof url === 'string'))
    .withMessage('Each attachment must be a string'),

  body('comments')
    .optional()
    .isArray().withMessage('Comments must be an array')
    .custom((arr) =>
      arr.every(
        (comment) =>
          typeof comment.text === 'string' &&
          (!comment.user || mongoose.Types.ObjectId.isValid(comment.user))
      )
    )
    .withMessage('Each comment must have a text string and optional valid user ID')
];
