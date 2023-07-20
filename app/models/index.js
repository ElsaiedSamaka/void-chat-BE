const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
// ==========================
db.user = require("./user.model.js")(sequelize, Sequelize);
db.user_logins = require("./user_logins.js")(sequelize, Sequelize);
db.message = require("./message.js")(sequelize,Sequelize);
db.conversation = require("./conversation.model.js")(sequelize,Sequelize)
// ==========================
// relationships db.user <=> db.message
db.message.belongsTo(db.user, { as: "sender" });
db.message.belongsTo(db.user, { as: "recipient" });
db.message.belongsToMany(db.user, { through: 'message-recipients', as: 'recipients' });
db.user.belongsToMany(db.message, { through: 'message-recipients', as: 'receivedMessages' });
// relationships db.user <=> db.conversation
db.user.hasMany(db.conversation);
db.conversation.belongsTo(db.user, { as: 'user1' });
db.conversation.belongsTo(db.user, { as: 'user2' });
db.conversation.hasMany(db.message);
db.message.belongsTo(db.conversation);
module.exports = db;
