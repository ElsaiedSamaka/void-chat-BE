const { Op } = require("sequelize");

const Message = require("../models").message;

const getMessages = async (socket, io, payload) => {
  const { sender, recipient } = payload;
  console.log("sender", sender, "recipient", recipient);

  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        {
          senderId: sender,
          recipientId: recipient,
        },
        {
          senderId: recipient,
          recipientId: sender,
        },
      ],
    },
    include: {
      all: true,
    },
  });

  io.to(socket.id).emit("messages", messages);
};

module.exports = getMessages;
