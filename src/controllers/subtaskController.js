const Subtask = require('../models/Subtask');

exports.createSubtask = async (req, res) => {
  try {
    const { taskId, title } = req.body;
    const subtask = await Subtask.create({ task: taskId, title });
    res.status(201).json(subtask);
  } catch (error) {
    res.status(500).json({ message: 'Creating subtask failed', error });
  }
};
