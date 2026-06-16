const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const CT_HoaDonNhap = require("./ctHoaDonNhapModel");
const CT_HoaDonBan = require("./ctHoaDonBanModel");

const SanPham = sequelize.define(
  "SanPham",
  {
    maSP: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    ma_CTDM: {
      type: DataTypes.UUID,
      references: {
        model: "CT_DanhMuc",
        key: "ma_CTDM",
      },
      allowNull: false,
    },
    tenSP: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mauSP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anhSP: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        return JSON.parse(this.getDataValue("anhSP") || "[]");
      },
      set(value) {
        this.setDataValue("anhSP", JSON.stringify([].concat(value)));
      },
    },
    moTa: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    soLuong: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    giaTien: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: "SanPham",
  }
);

SanPham.associate = (models) => {
  SanPham.belongsTo(models.CTDanhMuc, {
    foreignKey: "ma_CTDM",
    as: "CTDanhMuc",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SanPham.hasMany(CT_HoaDonNhap, {
    foreignKey: "maSP",
    as: "CT_HoaDonNhaps",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  SanPham.hasMany(CT_HoaDonBan, {
    foreignKey: "maSP",
    as: "CT_HoaDonBans",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = SanPham;
