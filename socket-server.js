"use strict";

const socketIo = require("socket.io");
const ot = require("ot");

let roomlist = {};

module.exports = (server) => {
  let str = "this is a Markdown heading \n\n" + "const i = i + 1;";

  const Io = socketIo(server);

  Io.on("connection", (socket) => {
    console.log("new websocket connection made!");

    socket.on("joinRoom", function (data) {
      console.log(data);
      if (!roomlist[data.room]) {
        let socketIOServer = new ot.EditorSocketIOServer(
          str,
          [],
          data.room,
          function (socket, cb) {
            cb(true);
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
