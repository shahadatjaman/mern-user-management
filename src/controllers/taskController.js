const { Types, isValidObjectId } = require("mongoose");
const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      project: new Types.ObjectId(projectId),
      dueDate,
      assignedTo,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Creating task failed", error });
  }
};

exports.getProjectTasks = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    const projectId = new Types.ObjectId(req.params.id);
    const tasks = await Task.find({ project: projectId });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Fetching tasks failed", error });
  }
};

// Get Single Task
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Fetching task failed", error });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Updating task failed", error });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid Task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deleting task failed", error });
  }
};
