const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Project creation failed', error });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Fetching projects failed', error });
  }
};
