const HoaDonBan = require("../models/hoaDonBanModel");
const CTHoaDonBan = require("../models/ctHoaDonBanModel");
const SanPham = require("../models/sanPhamModel");
const NguoiDung = require("../models/nguoiDungModel");
const CTDanhMuc = require("../models/ctDanhMucModel");
const { Op, Sequelize } = require("sequelize");

exports.getAll = async (req, res) => {
  try {
    const hoaDonBans = await HoaDonBan.findAll({
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND", "sdt", "email", "diaChi"],
        },
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
          include: [
            {
              model: SanPham,
              as: "SanPham",
              attributes: ["tenSP", "anhSP"],
            },
          ],
        },
      ],
      order: [['ngayBan', 'DESC']],
    });

    res.status(200).json(hoaDonBans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const hoaDonBan = await HoaDonBan.findByPk(id, {
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND", "sdt", "email", "diaChi"],
        },
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
          include: [
            {
              model: SanPham,
              as: "SanPham",
              attributes: ["tenSP", "anhSP"],
            },
          ],
        },
      ],
    });

    if (!hoaDonBan) {
      return res.status(404).json({ error: "Hóa đơn bán không tồn tại" });
    }

    res.status(200).json(hoaDonBan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCTHDB = async (req, res) => {
  try {
    const chiTietHoaDonBans = await CTHoaDonBan.findAll({
      include: [
        {
          model: SanPham,
          as: "SanPham",
          attributes: ["tenSP", "anhSP"],
        },
      ],
    });

    res.status(200).json(chiTietHoaDonBans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByIdCTHDB = async (req, res) => {
  try {
    const chiTietHoaDonBan = await CTHoaDonBan.findByPk(req.params.id, {
      include: [
        {
          model: SanPham,
          as: "SanPham",
          attributes: ["tenSP", "anhSP"],
        },
      ],
    });

    if (!chiTietHoaDonBan) {
      return res.status(404).json({ error: "Chi tiết hóa đơn không tồn tại" });
    }

    res.status(200).json(chiTietHoaDonBan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const { maHDB, giamGia, phuongThuc, maND, ghiChu, CTHoaDonBans } = req.body;
    let hoaDonBan;
    if (maHDB) {
      hoaDonBan = await HoaDonBan.findByPk(maHDB, {
        include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
      });

      if (!hoaDonBan) {
        return res.status(404).json({ error: "Hóa đơn bán không tồn tại" });
      }
    } else {
      // Nếu chưa có thì tạo mới
      if (!phuongThuc || !maND) {
        return res
          .status(400)
          .json({ error: "Thiếu thông tin bắt buộc để tạo hóa đơn bán" });
      }

      hoaDonBan = await HoaDonBan.create({
        ngayBan: new Date(),
        trangThai: "Chờ duyệt",
        giamGia: giamGia || 0,
        tongTien: 0,
        phuongThuc,
        maND,
        ghiChu,
      });
    }

    // Xử lý từng chi tiết hóa đơn
    if (Array.isArray(CTHoaDonBans)) {
      for (const chiTiet of CTHoaDonBans) {
        const sanPham = await SanPham.findByPk(chiTiet.maSP);

        if (!sanPham) {
          throw new Error(`Sản phẩm với mã ${chiTiet.maSP} không tồn tại`);
        }

        if (sanPham.soLuong < chiTiet.soLuong) {
          throw new Error(`Sản phẩm ${sanPham.tenSP} không đủ hàng trong kho`);
        }

        // Không trừ kho ở đây nữa, chỉ trừ khi admin chuyển trạng thái sang "Đã duyệt"
        // if (sanPham.soLuong < 5) { // Cảnh báo nếu kho thấp
        //   console.warn(`Cảnh báo: Sản phẩm ${sanPham.tenSP} chỉ còn ${sanPham.soLuong} cái.`);
        // }

        // Kiểm tra sản phẩm đã tồn tại trong chi tiết hóa đơn chưa
        const chiTietTonTai = await CTHoaDonBan.findOne({
          where: {
            maHDB: hoaDonBan.maHDB,
            maSP: chiTiet.maSP,
          },
        });

        if (chiTietTonTai) {
          // Nếu đã có, cộng dồn số lượng và cập nhật thành tiền
          const soLuongMoi = chiTietTonTai.soLuong + chiTiet.soLuong;
          const thanhTienMoi = soLuongMoi * sanPham.giaTien;

          await chiTietTonTai.update({
            soLuong: soLuongMoi,
            thanhTien: thanhTienMoi,
          });
        } else {
          // Nếu chưa có, tạo mới chi tiết hóa đơn
          await CTHoaDonBan.create({
            maHDB: hoaDonBan.maHDB,
            maSP: chiTiet.maSP,
            soLuong: chiTiet.soLuong,
            donGia: sanPham.giaTien,
            thanhTien: chiTiet.soLuong * sanPham.giaTien,
          });
        }
      }
    }

    // Tính lại tổng tiền
    const tongThanhTien = await CTHoaDonBan.sum("thanhTien", {
      where: { maHDB: hoaDonBan.maHDB },
    });

    const tongSauGiam = Math.max(tongThanhTien - (hoaDonBan.giamGia || 0), 0);
    await hoaDonBan.update({ tongTien: tongSauGiam });

    // Trả về hóa đơn sau khi cập nhật
    const updatedHoaDonBan = await HoaDonBan.findByPk(hoaDonBan.maHDB, {
      include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
    });

    res.status(201).json(updatedHoaDonBan);
  } catch (error) {
    console.error("Lỗi tạo/cập nhật hóa đơn:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { maHDB, trangThai, ngayBan } = req.body;
    const hoaDon = await HoaDonBan.findByPk(maHDB, {
      include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
    });

    if (hoaDon !== null) {
      // Nếu chuyển từ trạng thái khác sang "Đã duyệt", thực hiện trừ kho
      if (trangThai === "Đã duyệt" && hoaDon.trangThai !== "Đã duyệt") {
        for (const ct of hoaDon.CTHoaDonBans) {
          const sanPham = await SanPham.findByPk(ct.maSP);
          if (sanPham) {
            if (sanPham.soLuong < ct.soLuong) {
              return res.status(400).json({
                error: `Sản phẩm ${sanPham.tenSP} không đủ hàng trong kho để duyệt đơn`,
              });
            }
            await sanPham.decrement("soLuong", { by: ct.soLuong });

            // Thông báo kho thấp sau khi trừ
            const updatedSP = await SanPham.findByPk(ct.maSP);
            if (updatedSP.soLuong < 5) {
              console.warn(
                `HỆ THỐNG: Sản phẩm [${updatedSP.tenSP}] sắp hết hàng. Còn lại: ${updatedSP.soLuong}`
              );
            }
          }
        }
      }

      const updateFields = { trangThai };
      if (ngayBan) updateFields.ngayBan = ngayBan;

      await hoaDon.update(updateFields);
      const updatedHoaDonBan = await HoaDonBan.findByPk(maHDB, {
        include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
      });
      res.status(200).json(updatedHoaDonBan);
    } else {
      res.status(404).json({ message: "Hóa đơn không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Nếu là chi tiết hóa đơn
    const chiTiet = await CTHoaDonBan.findByPk(id, {
      include: [{ model: HoaDonBan, as: "HoaDonBan" }],
    });
    if (chiTiet) {
      // Chỉ cộng lại kho nếu đơn hàng đã được duyệt (vì lúc đó mới trừ kho)
      if (chiTiet.HoaDonBan && chiTiet.HoaDonBan.trangThai === "Đã duyệt") {
        await SanPham.increment("soLuong", {
          by: chiTiet.soLuong,
          where: { maSP: chiTiet.maSP },
        });
      }

      const maHDB = chiTiet.maHDB;
      await chiTiet.destroy();

      // Tính lại tổng tiền nếu còn chi tiết
      const tongTien = await CTHoaDonBan.sum("thanhTien", { where: { maHDB } });
      await HoaDonBan.update({ tongTien: tongTien || 0 }, { where: { maHDB } });

      return res.status(200).json(chiTiet);
    }

    // Nếu là hóa đơn bán
    const hoaDon = await HoaDonBan.findByPk(id, {
      include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
    });
    if (!hoaDon) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy hóa đơn bán hoặc chi tiết" });
    }

    // Chỉ cộng lại kho cho tất cả sản phẩm nếu đơn hàng đã được duyệt
    if (hoaDon.trangThai === "Đã duyệt") {
      await Promise.all(
        hoaDon.CTHoaDonBans.map((ct) =>
          SanPham.increment("soLuong", {
            by: ct.soLuong,
            where: { maSP: ct.maSP },
          })
        )
      );
    }

    await CTHoaDonBan.destroy({ where: { maHDB: id } });
    await hoaDon.destroy();

    return res.status(200).json(hoaDon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const hoaDonBans = await HoaDonBan.findAll({
      include: [
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
        },
        {
          model: NguoiDung,
          as: "NguoiDung",
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          Sequelize.where(Sequelize.col("NguoiDung.tenND"), {
            [Op.like]: `%${keyword}%`,
          }),
          Sequelize.where(Sequelize.fn("DATE", Sequelize.col("ngayBan")), {
            [Op.like]: `%${keyword}%`,
          }),
          { tongTien: { [Op.like]: `%${keyword}%` } },
        ],
      },
      order: [['ngayBan', 'DESC']],
    });

    res.status(200).json(hoaDonBans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// thống kê doanh thu toàn bộ hóa đơn
exports.thongKeDoanhThu = async (req, res) => {
  try {
    const AllDoanhThu = await HoaDonBan.sum("tongTien", {
      where: { trangThai: "Đã duyệt" },
    });
    res.status(200).json({ AllDoanhThu: AllDoanhThu || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// thống kê số lượng hóa đơn bán
exports.thongKeSoLuongHDB = async (req, res) => {
  try {
    const AllSoLuong = await HoaDonBan.count();
    res.status(200).json({ AllSoLuong });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// thống kê số lượng hóa đơn bán theo trạng thái "Chờ duyệt"
exports.thongKeSoLuongHDBChuaDuyet = async (req, res) => {
  try {
    const AllSoLuongChuaDuyet = await HoaDonBan.count({
      where: { trangThai: "Chờ duyệt" },
    });
    res.status(200).json({ AllSoLuongChuaDuyet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// thống kê doanh thư theo ngày trong 7 ngày gần nhất

exports.thongKeDoanhThuNgay = async (req, res) => {
  try {
    // Lấy 7 ngày gần nhất có doanh thu > 0 và trạng thái "Đã duyệt"
    const doanhThuRaw = await HoaDonBan.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("ngayBan")), "ngayBan"],
        [Sequelize.fn("SUM", Sequelize.col("tongTien")), "doanhThu"],
      ],
      where: { trangThai: "Đã duyệt" },
      group: [Sequelize.fn("DATE", Sequelize.col("ngayBan"))],
      having: Sequelize.literal("SUM(tongTien) > 0"),
      order: [[Sequelize.fn("DATE", Sequelize.col("ngayBan")), "DESC"]],
      limit: 7,
      raw: true,
    });
    // Sắp xếp lại tăng dần để hiển thị đúng thứ tự thời gian
    const AllDoanhThuNgay = doanhThuRaw.sort((a, b) =>
      a.ngayBan.localeCompare(b.ngayBan)
    );
    res.status(200).json({ AllDoanhThuNgay });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// thống kê top 5 danh mục có số lượng sản phẩm bán ra nhiều nhất
exports.thongKeTop5DanhMucBanChay = async (req, res) => {
  try {
    // Chỉ lấy top 5 danh mục có số lượng bán > 0 từ các hóa đơn "Đã duyệt"
    const AllTop5DanhMucBanChay = await CTHoaDonBan.findAll({
      attributes: [
        [Sequelize.col("SanPham.ma_CTDM"), "ma_CTDM"],
        [Sequelize.col("SanPham.CTDanhMuc.tenCTDM"), "tenCTDM"],
        [Sequelize.fn("SUM", Sequelize.col("CT_HoaDonBan.soLuong")), "soLuong"],
      ],
      include: [
        {
          model: SanPham,
          as: "SanPham",
          attributes: [],
          include: [
            {
              model: CTDanhMuc,
              as: "CTDanhMuc",
              attributes: [],
            },
          ],
        },
        {
          model: HoaDonBan,
          as: "HoaDonBan",
          attributes: [],
          where: { trangThai: "Đã duyệt" },
        },
      ],
      group: ["SanPham.ma_CTDM", "SanPham.CTDanhMuc.tenCTDM"],
      having: Sequelize.literal("SUM(CT_HoaDonBan.soLuong) > 0"),
      order: [
        [Sequelize.fn("SUM", Sequelize.col("CT_HoaDonBan.soLuong")), "DESC"],
      ],
      limit: 10,
      raw: true,
    });

    res.status(200).json({ AllTop5DanhMucBanChay });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy hóa đơn bán theo người dùng (theo id người dùng), có phân loại trạng thái
exports.getByUser = async (req, res) => {
  try {
    const { maND } = req.params;
    const hoaDonBans = await HoaDonBan.findAll({
      where: { maND },
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND", "sdt", "email", "diaChi"],
        },
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
          include: [
            {
              model: SanPham,
              as: "SanPham",
              attributes: ["tenSP", "anhSP"],
            },
          ],
        },
      ],
      order: [["ngayBan", "DESC"]],
    });

    // Phân loại theo trạng thái
    const daDuyet = hoaDonBans.filter((hd) => hd.trangThai === "Đã duyệt");
    const choDuyet = hoaDonBans.filter((hd) => hd.trangThai === "Chờ duyệt");
    const daHuy = hoaDonBans.filter((hd) => hd.trangThai === "Đã hủy");

    res.status(200).json({
      daDuyet,
      choDuyet,
      daHuy,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// "ấn hủy đơn hàng" sẽ chuyển trạng thái hóa đơn sang "Đã hủy"
exports.huyHoaDon = async (req, res) => {
  try {
    const { maHDB } = req.body;

    const hoaDonBan = await HoaDonBan.findByPk(maHDB);
    if (!hoaDonBan) {
      return res.status(404).json({ error: "Hóa đơn bán không tồn tại" });
    }

    // Chỉ cho phép hủy nếu trạng thái là "Chờ duyệt"
    if (hoaDonBan.trangThai !== "Chờ duyệt") {
      return res.status(400).json({
        error: "Chỉ có thể hủy hóa đơn có trạng thái 'Chờ duyệt'",
      });
    }

    // Cập nhật trạng thái hóa đơn
    await hoaDonBan.update({ trangThai: "Đã hủy" });

    // Trả về hóa đơn đã cập nhật
    const updatedHoaDonBan = await HoaDonBan.findByPk(maHDB, {
      include: [{ model: CTHoaDonBan, as: "CTHoaDonBans" }],
    });

    res.status(200).json(updatedHoaDonBan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// phân loại trạng thái hóa đơn bán gồm thông tin: Khách hàng, Ngày bán, Phương thức, Tổng tiền, Trạng thái, chi tiết hóa đơn(tên sản phẩm, ảnh sản phẩm, số lượng, đơn giá, thành tiền)
exports.getPhanLoaiTrangThai = async (req, res) => {
  try {
    const hoaDonBans = await HoaDonBan.findAll({
      include: [
        {
          model: NguoiDung,
          as: "NguoiDung",
          attributes: ["tenND"],
        },
        {
          model: CTHoaDonBan,
          as: "CTHoaDonBans",
          include: [
            {
              model: SanPham,
              as: "SanPham",
              attributes: ["tenSP", "anhSP"],
            },
          ],
        },
      ],
      order: [["ngayBan", "DESC"]],
    });

    //
    const format = (arr) =>
      arr.map((hd) => ({
        khachHang: hd.NguoiDung ? hd.NguoiDung.tenND : "",
        ngayBan: hd.ngayBan,
        phuongThuc: hd.phuongThuc,
        tongTien: hd.tongTien,
        trangThai: hd.trangThai,
        chiTiet: (hd.CTHoaDonBans || []).map((ct) => ({
          tenSP: ct.SanPham ? ct.SanPham.tenSP : "",
          anhSP: ct.SanPham ? ct.SanPham.anhSP : "",
          soLuong: ct.soLuong,
          donGia: ct.donGia,
          thanhTien: ct.thanhTien,
        })),
      }));

    // Phân loại theo trạng thái
    const daDuyet = format(
      hoaDonBans.filter((hd) => hd.trangThai === "Đã duyệt")
    );
    const choDuyet = format(
      hoaDonBans.filter((hd) => hd.trangThai === "Chờ duyệt")
    );
    const daHuy = format(hoaDonBans.filter((hd) => hd.trangThai === "Đã hủy"));

    res.status(200).json({
      daDuyet,
      choDuyet,
      daHuy,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
