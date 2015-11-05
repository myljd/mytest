var Sequelize = require("sequelize");
var sequelize = require('../../config/DAO');

module.exports = sequelize.define("order", {
    order_sn: Sequelize.STRING,
    consignee: Sequelize.INTEGER,
    user_id: Sequelize.STRING,
    product_id: Sequelize.STRING,
    is_paid: Sequelize.STRING,
    sub: Sequelize.STRING,
    area: Sequelize.STRING,
    detailed: Sequelize.STRING,
    tellphone: Sequelize.STRING,
    express: Sequelize.STRING,
    price: Sequelize.STRING,
    postage: Sequelize.STRING,
    remarks: Sequelize.STRING,
    time_new:Sequelize.STRING,
    pdf:Sequelize.STRING,
    status:Sequelize.INTEGER
}, {
    timestamps: false,
    tableName: "order"
})