const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const server = http.createServer(app);

const io = socketio(server);

io.on("connection", function (socket) {
  console.log("connected");

  socket.on("send-location", function (data) {
    console.log("data", data);
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", function () {
    io.emit("disconnected", socket.id);
  });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
