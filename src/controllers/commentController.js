const Comment = require('../models/Comment');
const Task = require('../models/Task');

exports.createComment = async (req, res) => {
  try {
    const { task, content } = req.body;
    const author = req.user._id;

    const taskExists = await Task.findById(task);
    if (!taskExists) return res.status(404).json({ message: 'Task not found' });

    const comment = await Comment.create({ task, author, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create comment', error: err.message });
  }
};

exports.getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const comments = await Comment.find({ task: taskId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (!comment.author.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to update this comment' });
    }

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update comment', error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (!comment.author.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await comment.remove();
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message });
  }
};
