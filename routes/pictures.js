const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
const pictureModal = require("../modals/picture");

const fs = require("fs");
// Get request to give data to the browser
router.get("/", async (request, response) => {
  try {
    const pictures = await pictureModal.find();
    response.json(pictures);
  } catch (error) {
    response.send(error);
  }
});
// Post request to get image from the admin
router.post("/", upload.single("image"), async (request, response) => {
  try {
    const picture = await new pictureModal({
      name: request.file.originalname,
      imagePath: "http://localhost:3000/images/" + request.file.originalname,
    });
    response.json(picture);
    const createdPicture = await picture.save();
    fs.readFile(request.file.path, (err, data) => {
      fs.writeFile(`images/${request.file.originalname}`, data, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  } catch (err) {
    response.send(err);
  }
});
//To remove all the data present in the database
router.delete("/", async (request, response) => {
  pictureModal.find({}, (err, pictures) => {
    if (err) return response.send(err);
    pictures.forEach((picture) => {
      fs.unlink(`images/${picture.name}`, (err) => {
        if (err) throw err;
      });
    });
  });
  pictureModal.remove({}, (err) => {
    if (err) return response.send(err);
    response.send("All pictures have been deleted");
  });
});
//To recieve an id and delete only that particular id from the modal
router.delete("/:id", async (request, response) => {
  const picture = await pictureModal.findById(request.params.id);
  fs.unlink(`images/${picture.name}`, (err) => {
    if (err) throw err;
  });
  pictureModal.findByIdAndRemove(request.params.id, (err) => {
    if (err) return response.send(err);
    response.send("Picture has been deleted");
  });
});
module.exports = router;
