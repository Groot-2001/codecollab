"use strict";

const socketIo = require("socket.io");
const ot = require("ot");
const Task = require("./models/task");

let roomlist = {};

module.exports = (server) => {
  let str =
    "//Welcome! folks on CodeCollab \n" +
    `console.log("Let's get Started!");\n`;

  const Io = socketIo(server);

  Io.on("connection", (socket) => {
    socket.on("joinRoom", function (data) {
      if (!roomlist[data.room]) {
        let socketIOServer = new ot.EditorSocketIOServer(
          str,
          [],
          data.room,
          async function (socket, cb) {
            try {
              let self = this;
              await Task.findByIdAndUpdate(data.room, {
                content: self.document,
              });
              cb(true);
            } catch (error) {
              console.error("Internal server Error", error);
              cb(false);
            }
          }
        );
        roomlist[data.room] = socketIOServer;
      }
      roomlist[data.room].addClient(socket);
      roomlist[data.room].setName(socket, data.username);

      socket.room = data.room;
      socket.join(data.room);
    });

    socket.on("chatMessage", function (data) {
      Io.to(socket.room).emit("chatMessage", data);
    });

    socket.on("disconnect", function () {
      socket.leave(socket.room);
    });
  });
};
