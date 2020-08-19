const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getProjectIdx(id) {
  return repositories.findIndex(repository => repository.id === id);
}

function hasID(request, response, next) {
  const { id } = request.params;
  const repositoryIdx = getProjectIdx(id);
  
  if (repositoryIdx < 0) {
    return response.status(400).json({ error: "Project not found."});
  }
  
  return next();
}

app.use("/repositories/:id", hasID);
app.use("/repositories/:id/likes", hasID);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIdx = getProjectIdx(id);

  let repository = repositories[repositoryIdx];
  repository.title = title;  
  repository.url = url;  
  repository.techs = techs;  
  
  repositories[repositoryIdx] = repository;
  
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIdx = getProjectIdx(id);
  
  if (repositoryIdx < 0) {
    return response.status(400).json({ error: "Project not found."});
  }
  
  repositories.splice(repositoryIdx, 1);
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIdx = getProjectIdx(id);
  
  if (repositoryIdx < 0) {
    return response.status(400).json({ error: "Project not found."});
  }
  
  let repository = repositories[repositoryIdx];
  repository.likes++;

  repositories[repositoryIdx] = repository;
  
  return response.json(repository);
});

module.exports = app;
