const express = require('express');

const { protect, restrictTo } = require('../middleware/authMiddleware');

const {
  createComment,
  getCommentsByTask,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const validateComment = require('../validators/validateComment');

const router = express.Router();

router.use(protect); // All routes below this require authentication


router.post('/', restrictTo('admin','manager','member'),validateComment, createComment);          // Create comment
router.get('/task/:taskId', restrictTo('admin','manager','member'), getCommentsByTask);          // Get comments by task
router.put('/:id', restrictTo('admin','manager','member'), updateComment);                       // Update comment
router.delete('/:id', restrictTo('admin','manager','member'),deleteComment);                    // Delete comment

module.exports = router;
