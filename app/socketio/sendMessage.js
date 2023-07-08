const getConnectedUser = require("../helper/getConnectedUser");

const Message = require("../models").message;
const User = require("../models").user;

const sendMessage = async (socket, io, data) => {
  const message = await Message.create({
    senderId: data.sender,
    recipientId: data.recipient,
    message: data.message,
    createdAt: new Date(),
  });
  const newMessage = await Message.findByPk(message.id, {
    include: { all: true },
  });

  // find the socketId of the user on recipientId and this will be our to()
  const recipient = await User.findByPk(message.recipientId);
  // find the socketId of the user on recipientId and this will be our to()
  const sender = await User.findByPk(message.senderId);
  // Send the message to the appropriate room
  io.to([recipient.socketId, sender.socketId]).emit("newMessage", newMessage);
  // in client we can handle whatever we want with newMessage event
};

module.exports = sendMessage;
