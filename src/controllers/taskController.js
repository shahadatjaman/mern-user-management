const { Types, isValidObjectId } = require('mongoose');
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    console.log('req.body',req.body);
    const { title, description, projectId, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      project: new Types.ObjectId(projectId),
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
    
    if(!isValidObjectId(req.params.id)){
     return res.status(400).json({message:"Invalid ObjectId"});
    };

    const projectId = new Types.ObjectId(req.params.id);
    const tasks = await Task.find({ project: projectId });
    

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Fetching tasks failed', error });
  }
};
