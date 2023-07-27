const testConnection = async (socket, io, payload) => {
    console.log("payload",payload);
    setInterval(() => {
        io.to(socket.id).emit("testrespond","hello from server")
      }, 2000);
}
module.exports = testConnection;