const getConnectedUser = require("../helper/getConnectedUser");

const Message = require("../models").message;
const User = require("../models").user;

const sendMessage = async (socket, io, data) => {
  const message = await Message.create({
    senderId: data.sender,
    message: data.message,
    createdAt: new Date(),
  });

  const sender = await User.findByPk(message.senderId);
  const recipients = await User.findAll({
    where: { id: data.recipients },
  });
  const newMessage = await Message.findByPk(message.id, {
    include: { all: true },
  });

  

  // Send the message to each recipient
  recipients.forEach((recipient) => {
    // Associate the recipients with the message instance
     newMessage.setRecipient(recipient.id);
    io.to(recipient.socketId).emit('newMessage', newMessage);
  });

  // Send the message to the sender as well
  io.to(sender.socketId).emit('newMessage', newMessage);
};

module.exports = sendMessage;
