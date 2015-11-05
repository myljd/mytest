var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("calendar_user_product", {
    user_id:Sequelize.STRING,
    template_id:Sequelize.INTEGER,
    coupon_distribution_id:Sequelize.INTEGER,
    is_finished: Sequelize.INTEGER,    // 是否13张照片都已上传完毕 
    is_editable: Sequelize.INTEGER,    // 是否还可以编辑
    finished_time: Sequelize.STRING,   // 提交时间
    delivered_time: Sequelize.STRING   // 到货时间
    },
    {
      timestamps:false,
      tableName:"calendar_user_product"
    }
  )