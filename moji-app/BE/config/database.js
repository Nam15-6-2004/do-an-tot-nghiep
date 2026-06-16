const { Sequelize } = require("sequelize");

//
const sequelize = new Sequelize("web", "luubanam", "nam12235", {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
  logging: false,
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
});

module.exports = sequelize;
