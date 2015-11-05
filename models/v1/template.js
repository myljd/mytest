var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("template", {
    cover_url: Sequelize.STRING,
    long: Sequelize.DECIMAL(10, 2), // 长
    width: Sequelize.DECIMAL(10, 2), // 宽
    height: Sequelize.DECIMAL(10, 2), // 高
    num: Sequelize.INTEGER, // 张数
    coupon_original_id: Sequelize.INTEGER,
    // coupon_flag:Sequelize.STRING,
    position: Sequelize.STRING // 个性化图片 距离左上角的相对位置，如 13.68,56.66 代表距离左边 13.68个长度单位（像素），距离上边距为 56.66个长度单位
}, {
    timestamps: false,
    tableName: "template"
})