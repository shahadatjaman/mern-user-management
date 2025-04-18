const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const {
  createTask,
  getProjectTasks,

} = require('../controllers/taskController');
const { createTaskValidator } = require('../validators/taskValidator');
const validateBodyNotEmpty = require('../middleware/validateBodyNotEmpty');

const router = express.Router();

router.use(protect); // All routes below this require authentication

router.post('/',restrictTo('admin','manager','member'), validateBodyNotEmpty,createTaskValidator,createTask);
router.get('/project/:projectId', restrictTo('admin','manager','member'),getProjectTasks);

module.exports = router;
