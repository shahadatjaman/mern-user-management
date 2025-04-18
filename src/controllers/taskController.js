const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      project: projectId,
      dueDate,
      assignedTo,
      createdBy: req.user.id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Creating task failed', error });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Fetching tasks failed', error });
  }
};
