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
  // Create a room name based on the senderId and recipientId
  const roomName = `room:${sender.id}-${recipients[0].id}`;
  for (const recipient of recipients) {
    await message.setRecipient(recipient)
  }
  // Send the message to the room
  const newMessage = await Message.findByPk(message.id,{include:{all:true}})
  io.to(roomName).emit('newMessage', newMessage);
};

module.exports = sendMessage;
