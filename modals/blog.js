const mongoose = require("mongoose");
//Schema for blog
const blogSchema = mongoose.Schema({
  imagePath: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  imageName: { type: String, required: true },
});

module.exports = mongoose.model("Blog", blogSchema);
