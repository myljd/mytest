var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("coupon_original", {
    brand:Sequelize.STRING,
    thumbnail: Sequelize.STRING,
    title: Sequelize.STRING,
    desc:Sequelize.STRING,
    code:Sequelize.STRING,
    numbers:Sequelize.STRING,
    time_last:Sequelize.STRING,
    size:Sequelize.STRING,
    sponsor:Sequelize.STRING,
    picture_ul:Sequelize.STRING,
    template_id:Sequelize.INTEGER
    },
    {
      timestamps:false,
      tableName:"coupon_original"
    }
  )