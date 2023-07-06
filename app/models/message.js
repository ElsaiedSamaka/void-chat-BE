module.exports = ( sequelize, DataTypes ) => {
    const Message = sequelize.define("message", {
      message: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
    });
    return Message
 }