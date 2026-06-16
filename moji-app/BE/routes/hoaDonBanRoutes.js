const express = require("express");
const {
  getByIdCTHDB,
  getAllCTHDB,
  getAll,
  getById,
  insert,
  update,
  remove,
  search,
  thongKeDoanhThu,
  thongKeSoLuongHDB,
  thongKeSoLuongHDBChuaDuyet,
  thongKeDoanhThuNgay,
  thongKeTop5DanhMucBanChay,

  getByUser,
  huyHoaDon,
  getPhanLoaiTrangThai,
} = require("../controllers/hoaDonBanController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { checkRole } = require("../middlewares/authorizeRole");

const router = express.Router();

router.get("/hoadonban/getall", getAll);
router.get("/hoadonban/getbyid/:id", getById);
router.post("/hoadonban/insert", verifyToken, insert);
router.put("/hoadonban/update", verifyToken, checkRole(["A00"]), update);
router.put("/hoadonban/huydonhang", verifyToken, huyHoaDon);
router.delete("/hoadonban/delete/:id", verifyToken, checkRole(["A00"]), remove);
router.get("/hoadonban/search", search);
router.get("/hoadonban/user/:maND", verifyToken, getByUser);
router.get(
  "/hoadonban/phanloaitrangthai",
  verifyToken,
  checkRole(["A00"]),
  getPhanLoaiTrangThai
);

router.get("/cthoadonban/getall", getAllCTHDB);
router.get("/cthoadonban/getbyid/:id", getByIdCTHDB);

router.get(
  "/thongke/alltongtien",
  verifyToken,
  checkRole(["A00"]),
  thongKeDoanhThu
);
router.get(
  "/thongke/allsoluonghdb",
  verifyToken,
  checkRole(["A00"]),
  thongKeSoLuongHDB
);
router.get(
  "/thongke/allsoluonghdbchuaduyet",
  verifyToken,
  checkRole(["A00"]),
  thongKeSoLuongHDBChuaDuyet
);
router.get(
  "/thongke/doanhthutheongay",
  verifyToken,
  checkRole(["A00"]),
  thongKeDoanhThuNgay
);
router.get(
  "/thongke/topdanhmucbanchay",
  verifyToken,
  checkRole(["A00"]),
  thongKeTop5DanhMucBanChay
);

module.exports = router;
