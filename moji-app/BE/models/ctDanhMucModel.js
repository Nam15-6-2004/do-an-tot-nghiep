const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CTDanhMuc = sequelize.define(
  "CT_DanhMuc",
  {
    ma_CTDM: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    maDM: {
      type: DataTypes.UUID,
      references: {
        model: "DanhMuc",
        key: "maDM",
      },
      allowNull: false,
    },
    tenCTDM: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "CT_DanhMuc",
  }
);

CTDanhMuc.associate = (models) => {
  CTDanhMuc.belongsTo(models.DanhMuc, {
    foreignKey: "maDM",
    as: "DanhMuc",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  CTDanhMuc.hasMany(models.SanPham, {
    foreignKey: "ma_CTDM",
    as: "SanPhams",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = CTDanhMuc;
