const mongoose = require("mongoose");

const projectschema = mongoose.Schema({
  projectName: { type: String, required: true },
  projectDomain: { type: String, required: true },
  projectDescription: { type: String, required: true },
  projectLink: { type: String, required: true },
});

module.exports = mongoose.model("Project", projectschema);
