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
  // Send the message to each recipient
  for (const recipient of recipients) {
    await message.setRecipient(recipient)
    const newMessage = await Message.findByPk(message.id,{include:{all:true}})
    const recipientRoom = `user:${recipient.id}`;
    io.to(recipientRoom).emit('newMessage', newMessage);
  }

  // Send the message to the sender as well
  const newMessage = await Message.findByPk(message.id,{include:{all:true}})
  const senderRoom = `user:${sender.id}`;
  io.to(senderRoom).emit('newMessage', newMessage);
};

module.exports = sendMessage;
