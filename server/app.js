const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const routes = require("./routes");
const http = require("http"); // Import http to create a server
const socketIo = require("socket.io"); // Import socket.io

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app); // Create the HTTP server
const io = socketIo(server); // Attach Socket.io to the server

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://shmp:shmp@cluster27.d6hauw2.mongodb.net/portfolio?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

// Use routes
app.use("/", routes);

// API Endpoint for contact form
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Name: ${name}, Email: ${email}, Message: ${message}`);
  res.status(200).json({ message: "Message received!" });
});

// Set up Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  // Broadcast a message to all connected clients every 5 seconds
  setInterval(() => {
    socket.emit("number", parseInt(Math.random() * 10));
  }, 5000);

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
