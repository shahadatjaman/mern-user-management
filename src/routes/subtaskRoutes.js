const express = require('express');
const router = express.Router();
const {
  createSubtask,
  getSubtasksByTask,
  updateSubtask,
  deleteSubtask,
} = require('../controllers/subtaskController');

const {restrictTo, protect} = require('../middleware/authMiddleware');
const validateSubtask = require('../validators/validateSubtask');

router.use(protect);

router.post(
  '/',
  restrictTo('admin', 'manager', 'member'),
  validateSubtask,
  createSubtask
);

router.get(
  '/task/:taskId',
  restrictTo('admin', 'manager', 'member'),
  getSubtasksByTask
);

router.patch(
  '/:subtaskId',
  restrictTo('admin', 'manager', 'member'),
  updateSubtask
);

router.delete(
  '/:subtaskId',
  restrictTo('admin', 'manager', 'member'),
  deleteSubtask
);

module.exports = router;
