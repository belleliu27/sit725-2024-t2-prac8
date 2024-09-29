require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const mongoose = require("mongoose");
const app = require("../server/app"); // Ensure this path is correct
const Project = require("../server/models/Project"); // Ensure this path is correct

const expect = chai.expect;

chai.use(chaiHttp);

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  await Project.deleteMany({});
  await mongoose.disconnect();
});

describe("Projects API", () => {
  let projectId;

  it("should list all projects on /api/projects GET", (done) => {
    chai
      .request(app)
      .get("/api/projects")
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should create a project on /api/projects POST", (done) => {
    const newProject = {
      title: "Test Project",
      description: "This is a test project.",
      image: "./img/test.png",
      link: "https://example.com",
    };

    chai
      .request(app)
      .post("/api/projects")
      .send(newProject)
      .end((err, res) => {
        if (err) return done(err);
        projectId = res.body._id; // Save the project ID for later tests
        expect(res).to.have.status(201);
        expect(res.body).to.have.property("title").eql(newProject.title);
        done();
      });
  });

  it("should update a project on /api/projects/:id PUT", (done) => {
    const updatedProject = {
      title: "Updated Test Project",
      description: "This is an updated test project.",
      image: "./img/updated.png",
      link: "https://example.com/updated",
    };

    chai
      .request(app)
      .put(`/api/projects/${projectId}`)
      .send(updatedProject)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("title").eql(updatedProject.title);
        done();
      });
  });

  it("should delete a project on /api/projects/:id DELETE", (done) => {
    chai
      .request(app)
      .delete(`/api/projects/${projectId}`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(204);
        done();
      });
  });

  it("should return 400 for invalid project data", (done) => {
    chai
      .request(app)
      .post("/api/projects")
      .send({}) // Send invalid data
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should retrieve a single project by ID on /api/projects/:id GET", (done) => {
    const newProject = new Project({
      title: "Test Project",
      description: "This is a test project.",
      image: "./img/test.png",
      link: "https://example.com",
    });

    newProject.save().then((savedProject) => {
      chai
        .request(app)
        .get(`/api/projects/${savedProject._id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("title").eql("Test Project");
          done();
        });
    });
  });

  it("should return 400 for invalid project ID on /api/projects/:id PUT", (done) => {
    chai
      .request(app)
      .put("/api/projects/invalid-id")
      .send({ title: "New Title" })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(400);
        done();
      });
  });

  it("should handle POST requests to /api/contact", (done) => {
    const contactData = {
      name: "John Doe",
      email: "john.doe@example.com",
      message: "Hello, this is a test message!",
    };

    chai
      .request(app)
      .post("/api/contact")
      .send(contactData)
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").eql("Message received!");
        done();
      });
  });

  it("should return 405 for unsupported HTTP methods on /api/projects", (done) => {
    chai
      .request(app)
      .patch("/api/projects")
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(405);
        done();
      });
  });
});
