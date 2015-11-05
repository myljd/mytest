var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("coupon_distribution", {
    original_id: Sequelize.INTEGER,
    pin_code: Sequelize.STRING,
    coupon_number: Sequelize.STRING,
    is_activated: Sequelize.INTEGER,
    user_id: Sequelize.STRING,
    is_paid: Sequelize.INTEGER,
    brand: Sequelize.STRING,
    thumbnail: Sequelize.STRING,
    title: Sequelize.STRING,
    desc: Sequelize.STRING,
    // code: Sequelize.STRING,
    numbers: Sequelize.STRING,
    time_last: Sequelize.STRING,
    size: Sequelize.STRING,
    // sponsor: Sequelize.STRING,
    picture_ul: Sequelize.STRING,
    template_id: Sequelize.INTEGER
}, {
    timestamps: false,
    tableName: "coupon_distribution"
})