const db = require("../models");
const DanhMuc = require("../models/danhMucModel");
const CTDanhMuc = require("../models/ctDanhMucModel");
const SanPham = require("../models/sanPhamModel");
const { Op } = require("sequelize");

exports.getAllCTDM = async (req, res) => {
  try {
    const danhMucCTs = await CTDanhMuc.findAll({
      include: [
        {
          model: SanPham,
          as: "SanPhams",
        },
      ],
    });

    const result = danhMucCTs.map((ctdm) => ({
      ma_CTDM: ctdm.ma_CTDM,
      maDM: ctdm.maDM,
      tenCTDM: ctdm.tenCTDM,
      SanPhams: ctdm.SanPhams,
    }));

    return res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getByIdCTDM = async (req, res) => {
  try {
    const danhMucCT = await CTDanhMuc.findByPk(req.params.id, {
      include: [
        {
          model: SanPham,
          as: "SanPhams",
        },
      ],
    });
    if (danhMucCT) {
      res.status(200).json({
        ma_CTDM: danhMucCT.ma_CTDM,
        maDM: danhMucCT.maDM,
        tenCTDM: danhMucCT.tenCTDM,
        SanPhams: danhMucCT.SanPhams,
      });
    } else {
      res.status(404).json({ message: "Chi tiết danh mục không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const danhMucs = await DanhMuc.findAll({
      include: [{ model: CTDanhMuc, as: "CTDanhMucs" }],
    });
    const result = danhMucs.map((dm) => ({
      ...dm.toJSON(),
      CTDanhMucs: dm.CTDanhMucs,
    }));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const danhMuc = await DanhMuc.findByPk(req.params.id, {
      include: [{ model: CTDanhMuc, as: "CTDanhMucs" }],
    });
    if (danhMuc) {
      res.status(200).json({
        ...danhMuc.toJSON(),
        CTDanhMucs: danhMuc.CTDanhMucs,
      });
    } else {
      res.status(404).json({ message: "Danh mục không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    const { tenDM, maDM, CTDanhMucs } = req.body;

    let danhMuc;

    // tenDM - Tạo danh mục mới
    if (tenDM) {
      danhMuc = await DanhMuc.create({ tenDM });
    }
    //  maDM - Lấy danh mục có sẵn
    else if (maDM) {
      danhMuc = await DanhMuc.findByPk(maDM);
      if (!danhMuc) {
        return res.status(404).json({ error: "Danh mục không tồn tại" });
      }
    } else {
      return res.status(400).json({ error: "Cần cung cấp tenDM hoặc maDM" });
    }

    // Nếu có danh sách CTDanhMucs, tạo từng cái và liên kết với danh mục
    if (CTDanhMucs && Array.isArray(CTDanhMucs)) {
      const chiTietDanhMucs = await Promise.all(
        CTDanhMucs.map(async (chiTiet) => {
          return await CTDanhMuc.create({
            tenCTDM: chiTiet.tenCTDM,
            maDM: danhMuc.maDM,
          });
        })
      );

      danhMuc.CTDanhMucs = chiTietDanhMucs;
    }

    const updatedDanhMuc = await DanhMuc.findByPk(danhMuc.maDM, {
      include: [{ model: CTDanhMuc, as: "CTDanhMucs" }],
    });

    res.status(201).json(updatedDanhMuc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { maDM, tenDM, CTDanhMucs } = req.body;

    // có maDM cập nhật tenDM
    if (maDM && tenDM) {
      const danhMuc = await DanhMuc.findByPk(maDM);
      if (!danhMuc) {
        return res.status(404).json({ message: "Danh mục không tồn tại" });
      }
      await danhMuc.update({ tenDM });
    }

    // có CTDanhMucs cập nhật từng chi tiết
    if (CTDanhMucs && Array.isArray(CTDanhMucs)) {
      await Promise.all(
        CTDanhMucs.map(async (chiTiet) => {
          if (chiTiet.ma_CTDM && chiTiet.tenCTDM) {
            const chiTietDanhMuc = await CTDanhMuc.findByPk(chiTiet.ma_CTDM);
            if (chiTietDanhMuc) {
              await chiTietDanhMuc.update({ tenCTDM: chiTiet.tenCTDM });
            }
          }
        })
      );
    }

    //
    const updatedDanhMuc = await DanhMuc.findByPk(maDM, {
      include: [{ model: CTDanhMuc, as: "CTDanhMucs" }],
    });

    res.status(200).json(updatedDanhMuc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // maCTDM xóa chi tiết
    const chiTiet = await CTDanhMuc.findByPk(id);
    if (chiTiet) {
      await chiTiet.destroy();
      return res.status(200).json(chiTiet);
    }

    // maDM xóa danh mục
    const danhMuc = await DanhMuc.findByPk(id, {
      include: [{ model: CTDanhMuc, as: "CTDanhMucs" }],
    });
    if (danhMuc) {
      const danhMucCopy = JSON.parse(JSON.stringify(danhMuc));

      await CTDanhMuc.destroy({ where: { maDM: id } });
      await danhMuc.destroy();

      return res.status(200).json(danhMucCopy);
    }

    res
      .status(404)
      .json({ error: "Không tìm thấy danh mục hoặc chi tiết danh mục" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q } = req.query;

    // Tìm danh mục có giống tên
    const danhMucs = await DanhMuc.findAll({
      where: { tenDM: { [Op.like]: `%${q}%` } },
      include: [{ model: CTDanhMuc, as: "CTDanhMucs" }],
    });

    // Nếu tìm thấy danh mục, trả về luôn
    if (danhMucs.length > 0) {
      return res.status(200).json(
        danhMucs.map((dm) => ({
          ...dm.toJSON(),
          CTDanhMucs: dm.CTDanhMucs,
        }))
      );
    }

    // Nếu không tìm thấy danh mục, thử tìm trong chi tiết danh mục
    const chiTietDMs = await CTDanhMuc.findAll({
      where: { tenCTDM: { [Op.like]: `%${q}%` } },
    });

    if (chiTietDMs.length > 0) {
      return res.status(200).json(
        chiTietDMs.map((ct) => ({
          ...ct.toJSON(),
        }))
      );
    }

    //
    res.status(404).json({ message: "Không tìm thấy kết quả phù hợp" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.searchCTDMOrSanPham = async (req, res) => {
  try {
    const { q } = req.query;

    // 1. Tìm chi tiết danh mục có tên giống từ khóa
    const chiTietDMs = await CTDanhMuc.findAll({
      where: { tenCTDM: { [Op.like]: `%${q}%` } },
      include: [
        {
          model: SanPham,
          as: "SanPhams",
        },
      ],
    });

    if (chiTietDMs.length > 0) {
      const result = chiTietDMs.map((ctdm) => ({
        ma_CTDM: ctdm.ma_CTDM,
        tenCTDM: ctdm.tenCTDM,
        SanPhams: ctdm.SanPhams,
      }));

      return res.status(200).json({ type: "ChiTietDanhMuc", result });
    }

    // 2. Nếu không có chi tiết, thử tìm sản phẩm
    const sanPhams = await SanPham.findAll({
      where: { tenSP: { [Op.like]: `%${q}%` } },
      include: [
        {
          model: CTDanhMuc,
          as: "CTDanhMuc",
          attributes: ["ma_CTDM", "tenCTDM"],
        },
      ],
    });

    if (sanPhams.length > 0) {
      const result = sanPhams.map((sp) => ({
        maSP: sp.maSP,
        tenSP: sp.tenSP,
        giaTien: sp.giaTien,
        moTa: sp.moTa,
        anhSP: sp.anhSP,
        mauSP: sp.mauSP,
        code: sp.code,

        CTDanhMuc: sp.CTDanhMuc,
      }));

      return res.status(200).json({ type: "SanPham", result });
    }

    return res.status(404).json({ message: "Không tìm thấy kết quả phù hợp" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
