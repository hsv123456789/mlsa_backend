const express = require("express");
const router = express.Router();
const projectModal = require("../modals/project");
//To get all the projects
router.get("/", async (request, response) => {
  const projects = await projectModal.find();
  response.json(projects);
});
//To post a new project
router.post("/", async (request, response) => {
  try {
    const domain = request.body.domain;
    const name = request.body.projectname;
    const description = request.body.projectdescription;
    const link = request.body.projectlink;

    const newProject = await projectModal.create({
      projectName: name,
      projectDomain: domain,
      projectDescription: description,
      projectLink: link,
    });

    response.json(newProject);
  } catch (err) {
    response.json({ err: err.message });
  }
});
//To delete a single project
router.delete("/:id", async (request, response) => {
  try {
    projectModal.findByIdAndRemove(request.params.id, (err) => {
      if (err) response.json({ err: err.message });
      response.json({ message: "Project Removed sucessfully" });
    });
  } catch (err) {
    response.send({ err: err.message });
  }
});
//To delete all the projects
router.delete("/", async (request, response) => {
  try {
    projectModal.deleteMany({}, (err) => {
      if (err) response.json({ error: err.message });
      response.json({ message: "All the files have been deleted sucessfully" });
    });
  } catch (err) {
    response.json({ error: err.message });
  }
});

module.exports = router;
