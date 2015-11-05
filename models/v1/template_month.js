var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("template_month", {
    template_id: Sequelize.INTEGER,
    month: Sequelize.STRING,
    month_url: Sequelize.STRING,
    month_local_name:Sequelize.STRING,
    left: Sequelize.INTEGER,
    top: Sequelize.INTEGER,
    image_width:Sequelize.INTEGER,
    image_height:Sequelize.INTEGER,
    page_width:Sequelize.INTEGER,
    page_height:Sequelize.INTEGER
}, {
    timestamps: false,
    tableName: "template_month"
})