const socketio = require("socket.io");
const getMessages = require( "./getMessages" );
const sendMessage = require("./sendMessage");
const getConnectedUser = require("../helper/getConnectedUser");
const getContactedUsers = require("./getContacts");
function setupSocket(server) {
  const io = socketio(server, {
    cors: {
      origin: "*",
      methods: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log(`Socket.IO client ${socket.id} connected`);
    // get current user
    const userSocketId = await getConnectedUser(socket);
    socket.on('init',(payload)=>{
      socket.join(`socketId:${userSocketId}`)
    })
    console.info("userSocketId ==========>",userSocketId);

    // 2 users connection room 
    socket.on('join', (payload) => {
      socket.join(`room:${payload.userId}-${payload.recipientId}`);
      socket.join(`room:${payload.recipientId}-${payload.userId}`);
    });
    socket.on('leave', (payload) => {
      socket.leave(`room:${payload.userId}-${payload.recipientId}`);
      socket.leave(`room:${payload.recipientId}-${payload.userId}`);
    });
    
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
    // get contacts
    socket.on("getContacts",(payload)=>{
      getContactedUsers(socket, io, payload).catch((error) => {
        console.error(`Error getting contacts: ${error}`);
      });
    })
    // test
    socket.on("testevent", (payload)=>{
      console.log("payload",payload);
      setInterval(() => {
        socket.to(`socketId:${userSocketId}`).emit("testrespond","hello from server")
      }, 2000);
    })
    // handle disconnecting
    socket.on("disconnect", () => {
      console.log(`Socket.IO client ${socket.id} disconnected`);
    });
  });
}

module.exports = setupSocket;
