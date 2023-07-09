const { Op } = require("sequelize");
const { user } = require("../models");
const Conversation = require("../models").conversation;

// Get List of Conversations
const getConversations = async (req, res) => {
    const userId = req.userId
    try {
      const conversations = await Conversation.findAll({ where: {
        [Op.or]: [
          { user1id: userId },
          { user2id: userId }
        ]
      },
      include: [{
        model: user,
        as: 'user1'
      }, {
        model: user,
        as: 'user2'
      }]})
      if (!conversations) return res.status(404).json({ message: "No conversations found" });
      res.status(200).json(conversations);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while retrieving Conversations.",
      });
    }
  };

  const createConversation = async (req, res) => {
    try {
     const conversation = await  Conversation.create({
         user1_id: req.body.user1_id,
         user2_id: req.body.user2_id
       })  
       if(!conversation) 
       return res.status(404).json({ message: "No conversation found" })
       res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json({
          message: err.message || "Some error occurred while creating Conversations.",
        }); 
    }
 }
const getConversation = async  (req, res) => {
    Conversation.findByPk(req.params.id, { include: [Message] }).then(conversation => {
      return res.send(conversation);
    }).catch(err => {
      return res.status(500).send(err);
    });
  }
  module.exports ={
    getConversations,
    getConversation,
    createConversation
  }