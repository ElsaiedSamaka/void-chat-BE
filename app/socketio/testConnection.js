const testConnection = async (socket, io, payload) => {
    console.log("payload from the client",payload);
    // setInterval(() => {
    //     io.to(socket.id).emit("testrespond","hello from server")
    //   }, 5000);
}
module.exports = testConnection;