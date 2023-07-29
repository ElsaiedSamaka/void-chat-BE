const { Op } = require("sequelize");
const getConnectedUser = require("../helper/getConnectedUser");

const User = require("../models").user;
const Message = require("../models").message;

const getContactedUsers = async (socket, io, payload) => {
    const {user} = payload;
    try {
        const messages = await Message.findAll({
          where: {
            [Op.or]: [{ senderId: user.id }, { recipientId: user.id }],
          },
          include: [
            {
              model: User,
              as: "sender",
            },
            {
              model: User,
              as: "recipient",
            },
          ],
          order: [["createdAt", "DESC"]],
        });
    
        const uniqueRecipients = new Array();
    
        messages.forEach((message) => {
          const recipientId = message.recipientId;
          const senderId = message.senderId;
          if (recipientId !== user.id  && !uniqueRecipients.includes(recipientId)) {
            uniqueRecipients.push(recipientId);
          }
          if (senderId !==user.id  && !uniqueRecipients.includes(senderId)) {
            uniqueRecipients.push(senderId);
          }
        });
    
        const uniqueUsers = await User.findAll({
          where: {
            id: uniqueRecipients,
          },
        });
        io.to(socket.id || user.socketId).emit("contacts", uniqueUsers);
      } catch (err) {
        console.log("error while retrieving contacted users",err);
      }
}
module.exports = getContactedUsers;