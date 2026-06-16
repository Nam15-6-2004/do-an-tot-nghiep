const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DanhMuc = sequelize.define(
  "DanhMuc",
  {
    maDM: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenDM: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "DanhMuc",
  }
);

DanhMuc.associate = (models) => {
  DanhMuc.hasMany(models.CTDanhMuc, {
    foreignKey: "maDM",
    as: "CTDanhMucs",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = DanhMuc;
