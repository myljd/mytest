var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("address", {
    user_id: Sequelize.STRING,
    sub:Sequelize.STRING,
    area: Sequelize.STRING,
    detailed: Sequelize.STRING,
    consignee:Sequelize.INTEGER,
    tellphone:Sequelize.STRING,
    cellphone:Sequelize.STRING,
    is_default:Sequelize.STRING
    },
    {
      timestamps:false,
      tableName:"address"
    }
  )