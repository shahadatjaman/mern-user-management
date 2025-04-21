const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { createTaskValidator } = require("../middleware/taskValidator");

const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.use(protect); // All routes below this require authentication

router.post(
  "/",
  restrictTo("admin", "manager", "member"),
  createTaskValidator,
  validateRequest,
  createTask
);
router.get(
  "/project/:id",
  restrictTo("admin", "manager", "member"),
  getProjectTasks
);
router.get("/:id", restrictTo("admin", "manager", "member"), getTaskById);
router.put("/:id", restrictTo("admin", "manager", "member"), updateTask);
router.delete("/:id", restrictTo("admin", "manager", "member"), deleteTask);

module.exports = router;
