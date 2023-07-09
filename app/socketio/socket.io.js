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

    // Extract the user ID from the query parameter
    const socketId = socket.handshake.query.socketId;
    console.log("socketId", socketId);

    // Join the room corresponding to the user ID
    socket.join(socketId);

    // get current user
    getConnectedUser(socket);
    // get messages
    socket.on("getMessages", (payload) => {
      getMessages(socket, io, payload).catch((error) => {
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
