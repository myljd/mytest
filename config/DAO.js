
var Sequelize = require("sequelize");
var sequelize = new Sequelize('cloud_printing', 'root', 'bread2012', {
      host: "www.bread-tech.com",
      port: 3306
  });

module.exports = sequelize;