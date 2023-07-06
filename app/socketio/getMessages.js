const Message = require("../models").message;
const getMessages = async (socket, io) => {
  const messages = await Message.findAll({
    include: {
      all: true,
    },
  });
  io.emit("messages", messages);
};
module.exports = getMessages;
