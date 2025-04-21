const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validateUpdateSubtask = [
  // Optional: Validate title
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Subtask title cannot be empty")
    .isLength({ min: 1 })
    .withMessage("Title must be at least 1 character long")
    .trim(),

  // Optional: Validate task reference
  body("task")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Task must be a valid MongoDB ObjectId"),

  // Optional: validate completed (boolean)
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be true or false"),

  // Optional: Validate createdBy reference
  body("createdBy")
    .optional()
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("createdBy must be a valid MongoDB ObjectId"),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = validateUpdateSubtask;
