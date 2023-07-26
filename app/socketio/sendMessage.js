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
  for (const recipient of recipients) {
    const recipientRoomName = `room:${recipient.id}-${data.sender}`;
    const senderRoomName = `room:${sender.id}-${recipients[0].id}`;
    await message.setRecipient(recipient)
    const newMessage = await Message.findByPk(message.id, { include: { all: true } });
    io.to(recipientRoomName,senderRoomName).emit('newMessage', newMessage);
  }
};

module.exports = sendMessage;
