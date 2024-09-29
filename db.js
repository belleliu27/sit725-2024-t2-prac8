const mongoose = require("mongoose");
const Project = require("./server/models/Project");

mongoose
  .connect(
    "mongodb+srv://shmp:shmp@cluster27.d6hauw2.mongodb.net/portfolio?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const projects = [
  {
    title: "Express Project",
    description: "This is a Express Project.",
    image: "./img/project1.png",
    link: "https://github.com/belleliu27/sit725-2024-t2-prac2",
  },
  {
    title: "Materialize Project",
    description: "This is a Materialize Project.",
    image: "./img/project2.png",
    link: "https://github.com/belleliu27/sit725-2024-t2-prac3",
  },
  {
    title: "MongoDB Project",
    description: "This is a MongoDB Project.",
    image: "./img/project3.png",
    link: "https://github.com/belleliu27/sit725-2024-t2-prac4",
  },
];

Project.insertMany(projects)
  .then(() => {
    console.log("Projects inserted");
    mongoose.connection.close();
  })
  .catch((err) => console.error("Insert error:", err));
