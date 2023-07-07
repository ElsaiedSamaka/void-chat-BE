const Message = require("../models").message;
const getMessages = async (socket, io, payload) => {
  console.log("getMessages called !!!!!!!!!!!");
  // const { sender, recipient } = payload;
  const messages = await Message.findAll({
    // where: {
    //   senderId: sender,
    //   recipientId: recipient,
    // },
    include: {
      all: true,
    },
  });
  io.emit("messages", messages);
};
module.exports = getMessages;
