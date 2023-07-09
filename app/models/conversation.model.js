module.exports = ( sequelize, DataTypes ) => {
    const Conversation = sequelize.define("conversation", {
     id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true,
       },
      createdAt: {
        type: DataTypes.DATE,
      },
    });
    return Conversation
 }