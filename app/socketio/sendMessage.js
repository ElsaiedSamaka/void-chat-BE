const Message = require( "../models" ).message;
const User = require( "../models" ).user;

const sendMessage = async (socket, io, data) => {
  const message = await Message.create({
    senderId: data.sender,
    recipientId: data.recipient,
    message: data.message,
    createdAt: new Date(),
  } );
const newMessage = await Message.findByPk(message.id, {
  include: { all: true },
} );
  io.emit("newMessage", newMessage);
  // in client we can handle whatever we want with newMessage event
};


module.exports = sendMessage;
