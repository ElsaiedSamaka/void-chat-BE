const socketio = require("socket.io");
const getMessages = require( "./getMessages" );
const sendMessage = require("./sendMessage");
const getConnectedUser = require("../helper/getConnectedUser")
function setupSocket(server) {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket.IO client ${socket.id} connected`);
    // get current user
    getConnectedUser(socket);
    // get messages
    socket.on("getMessages", () => {
      getMessages(socket, io).catch((error) => {
        console.error(`Error getting messages: ${error}`);
      });
    });
    // send message
    socket.on("sendMessage", (data) => {
      sendMessage(socket, io, data).catch((error) => {
        console.error(`Error sending message: ${error}`);
      });
    });
    // handle disconnecting
    socket.on("disconnect", () => {
      console.log(`Socket.IO client ${socket.id} disconnected`);
    });
  });
}

module.exports = setupSocket;
