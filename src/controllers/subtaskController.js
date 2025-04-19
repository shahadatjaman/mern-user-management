const { isValidObjectId, Types } = require('mongoose');
const Subtask = require('../models/Subtask');

exports.createSubtask = async (req, res) => {
  try {
    const { taskId, title,createdBy } = req.body;
    const taskObjId = new Types.ObjectId(taskId);
    
    const subtask = await Subtask.create({ task: taskObjId, title,createdBy });
    res.status(201).json(subtask);
  } catch (error) {
    
    res.status(500).json({ message: 'Creating subtask failed', error });
  }
};
exports.getSubtasksByTask = async (req, res) => {
  try {

    if(!isValidObjectId(req.params.taskId)){
      return res.status(400).json({message:"Invalid ObjectId"});
    };

    const taskId = new Types.ObjectId(req.params.taskId);

    const subtasks = await Subtask.find({ task: taskId }).populate('createdBy', 'name email avatar');
    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch subtasks', error: err.message });
  }
};

exports.updateSubtask = async (req, res) => {
  try {


    if(!isValidObjectId(req.params.id)){
      return res.status(400).json({message:"Invalid ObjectId"});
    };

    const id = new Types.ObjectId(req.params.id);

    const subtask = await Subtask.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });
    res.json(subtask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update subtask', error: err.message });
  }
};

exports.deleteSubtask = async (req, res) => {
  try {

    if(!isValidObjectId(req.params.id)){
      return res.status(400).json({message:"Invalid ObjectId"});
    };

    const id = new Types.ObjectId(req.params.id);
    const subtask = await Subtask.findByIdAndDelete(id);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });
    res.json({ message: 'Subtask deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete subtask', error: err.message });
  }
};
