var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("calendar_user_post", {
    product_id:Sequelize.STRING,
    picture_url: Sequelize.STRING,
    qiniu_url :Sequelize.STRING,
    pos:Sequelize.INTEGER,   // 0 代表封面 1代表1月..... 12代表12月
    //qiniu_url:sequelize.STRING
    name:Sequelize.STRING
    },
    {
      timestamps:false,
      tableName:"calendar_user_post"
    }
  )