const express = require("express");
const router = express.Router();
const projectController = require("./controllers/projectController");

// API route to get all projects
router.get("/api/projects", projectController.getProjects);

// Route to get a single project by ID
router.get("/api/projects/:id", projectController.getProjectById);

// API route to create a new project
router.post("/api/projects", projectController.createProject);

// API route to update a project by ID
router.put("/api/projects/:id", projectController.updateProject);

// API route to delete a project by ID
router.delete("/api/projects/:id", projectController.deleteProject);

// Route to handle unsupported methods on /api/projects
router.all("/api/projects", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

module.exports = router;
