const express = require("express");
const blogModal = require("../modals/blog");
const multer = require("multer");
const fs = require("fs");

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
//To get all the blogs
router.get("/", async (request, response) => {
  try {
    const blog = await blogModal.find();
    response.json(blog);
  } catch (err) {
    response.send(err);
  }
});

//To create a new blog
router.post("/", upload.single("images"), async (request, response) => {
  try {
    const title = request.body.title;
    const author = request.body.author;
    const content = request.body.content;

    const imagepath =
      "http://localhost:3000/images/" + request.file.originalname;
    const blog = await new blogModal({
      title: title,
      author: author,
      imagePath: imagepath,
      content: content,
      imageName: request.file.originalname,
    });
    const createdblog = await blog.save();
    response.json(createdblog);
    fs.readFile(request.file.path, (err, data) => {
      fs.writeFile(`images/${request.file.originalname}`, data, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  } catch (err) {
    response.json(err);
  }
});
//To delete all blogs
router.delete("/", async (request, response) => {
  try {
    blogModal.find({}, (err, blogs) => {
      if (err) return response.send(err);
      blogs.forEach((blog) => {
        fs.unlink(`images/${blog.imageName}`, (err) => {
          if (err) throw err;
        });
      });
    });
    blogModal.remove({}, (err) => {
      if (err) return response.send(err);
      response.send("All blogs have been deleted");
    });
  } catch (err) {}
});
// To delete a single blog by recieving an id
router.delete("/:id", async (request, response) => {
  try {
    const blog = await blogModal.findById(request.params.id);
    fs.unlink(`images/${blog.imageName}`, (err) => {
      if (err) throw err;
    });
    blogModal.findByIdAndRemove(request.params.id, (err) => {
      if (err) return response.send(err);
      response.send("The blog has been removed sucessfully");
    });
  } catch (err) {
    response.send(err);
  }
});
module.exports = router;
