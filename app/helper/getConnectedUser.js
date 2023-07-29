const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/index.js").user;
// This is a helper function for handleing whenever a user connected to the socket server
const getConnectedUser = async ( socket ) => {
try {
  // Validate the input parameter
  if (!socket || typeof socket !== "object") {
    throw new Error("Invalid socket parameter");
  }

  // Get the user ID from the token and save the socket ID to the User model
  const token = socket.handshake.query.token;
  const decodedToken = jwt.verify(token, config.secret);
  const userId = decodedToken.id;

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  user.socketId = socket.id;
  await user.save();
  return socket.id;
} catch (error) {
  console.error("Error in getConnectedUser:", error);
  // Handle the error accordingly (e.g. emit an error event to the client)
}
};
module.exports = getConnectedUser;