const express = require("express");
const mongoose = require("mongoose");
const port = 3000;
const app = express();
const mongooseUrl = "mongodb://localhost:27017";
const path = require("path");
const cors = require("cors");
const pictureRouter = require("./routes/pictures");
const blogRouter = require("./routes/blogs");
const projectRouter = require("./routes/projects");
app.use(cors());
app.use(express.json());

//To connext to the mongodb database
mongoose.connect(mongooseUrl, async () => {
  await console.log(`Connection is successful `);
});

app.use("/pictures", pictureRouter);
app.use("/blogs", blogRouter);
app.use("/images", express.static(path.join("images")));
app.use("/projects", projectRouter);
//TO start the application
app.listen(port, () => {
  console.log(`The app has started in the port ${port}`);
});
