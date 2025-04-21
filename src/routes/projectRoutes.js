const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const {
  createProject,
  getUserProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const validateProject = require("../middleware/validateProject");
const validateProjectUpdate = require("../middleware/validateProjectUpdate");

const router = express.Router();

router.use(protect); // All routes below this require authentication

router.post(
  "/",
  restrictTo("admin", "manager", "member"),
  validateProject,
  createProject
);
router.get("/", restrictTo("admin", "manager", "member"), getUserProjects);
router.get("/:id", restrictTo("admin", "manager", "member"), getSingleProject);
router.put(
  "/:id",
  restrictTo("admin", "manager", "member"),
  validateProjectUpdate,
  updateProject
);
router.delete("/:id", restrictTo("admin", "manager", "member"), deleteProject);

module.exports = router;
