const express = require('express');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const {
  createTask,
  getProjectTasks,

} = require('../controllers/taskController');
const { createTaskValidator } = require('../middleware/taskValidator');
const validateBodyNotEmpty = require('../middleware/validateBodyNotEmpty');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect); // All routes below this require authentication

router.post('/',restrictTo('admin','manager','member'),createTaskValidator,validateRequest,createTask);
router.get('/project/:id', restrictTo('admin','manager','member'),getProjectTasks);

module.exports = router;
