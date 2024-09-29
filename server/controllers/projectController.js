const Project = require("../models/Project");

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a single project by ID
exports.getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    console.log("Fetched project:", project); // Add this line
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Invalid project ID" });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  const { title, description, image, link } = req.body;
  if (!title || !description || !image || !link) {
    return res.status(400).json({ message: "Invalid project data" });
  }

  try {
    const project = new Project(req.body);
    await project.save();
    console.log("Created project:", project); // Add this line
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, link } = req.body;

  if (!title || !description || !image || !link) {
    return res.status(400).json({ message: "Invalid project data" });
  }

  try {
    const project = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    console.log("Updated project:", project); // Add this line
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Invalid project ID" });
  }
};

// Delete a project by ID
exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    console.log("Deleted project:", project); // Add this line
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Invalid project ID" });
  }
};
