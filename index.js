const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let requestsNumber = 0;

function checkProjectExists(req, res, next) {
  const project = projects.find(project => project.id === req.params.id);
  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }
  return next();
}

server.use((req, res, next) => {
  requestsNumber++;

  console.log(`Number of requests: ${requestsNumber}`);

  return next();
});

server.post("/projects", (req, res) => {
  projects.push(req.body);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(project => {
    return project.id === id;
  });

  project.title = title;

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.find(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
