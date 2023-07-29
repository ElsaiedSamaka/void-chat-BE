const testConnection = async (socket, io, payload) => {
  const {mssg,user}= payload;
    console.log("payload from the client",mssg);
    console.log("socket.id",socket.id);
    console.log("user.socketId",user.socketId);
    setInterval(() => {
        io.to(user.socketId).emit("testrespond","hello from server")
      }, 5000);
}
module.exports = testConnection;