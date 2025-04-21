const express = require("express");
const router = express.Router();
const {
  createSubtask,
  getSubtasksByTask,
  updateSubtask,
  deleteSubtask,
} = require("../controllers/subtaskController");

const { restrictTo, protect } = require("../middleware/authMiddleware");
const validateSubtask = require("../middleware/validateSubtask");
const validateUpdateSubtask = require("../middleware/validateUpdateSubtask");

router.use(protect);

router.post(
  "/",
  restrictTo("admin", "manager", "member"),
  validateSubtask,
  createSubtask
);

router.get(
  "/task/:taskId",
  restrictTo("admin", "manager", "member"),
  getSubtasksByTask
);

router.put(
  "/task/:id",
  restrictTo("admin", "manager", "member"),
  validateUpdateSubtask,
  updateSubtask
);

router.delete(
  "/task/:id",
  restrictTo("admin", "manager", "member"),
  deleteSubtask
);

module.exports = router;
