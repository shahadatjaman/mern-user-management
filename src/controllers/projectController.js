const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Project creation failed", error });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Fetching projects failed", error });
  }
};

// Get single project by ID
exports.getSingleProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Fetching project failed", error });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { name, description },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Project update failed", error });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Project deletion failed", error });
  }
};
