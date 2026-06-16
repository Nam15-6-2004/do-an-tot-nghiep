const NguoiDung = require("../models/nguoiDungModel");
const { Op } = require("sequelize");
const md5 = require("md5");

exports.getAll = async (req, res) => {
  try {
    const nguoiDungs = await NguoiDung.findAll();
    res.status(200).json(nguoiDungs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findByPk(req.params.id);
    if (nguoiDung) {
      res.status(200).json(nguoiDung);
    } else {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.insert = async (req, res) => {
  try {
    console.log("BODY REGISTER:", req.body);

    const { tenND, diaChi, ngaySinh, sdt, email, taiKhoan, matKhau } = req.body;

    // Basic required-field validation
    if (!tenND || !diaChi || !ngaySinh || !sdt || !email || !taiKhoan || !matKhau) {
      return res.status(400).json({ 
        message: "Thiếu thông tin bắt buộc",
        receivedData: req.body 
      });
    }

    const nguoiDung = await NguoiDung.create({
      tenND,
      diaChi,
      ngaySinh,
      sdt,
      email,
      taiKhoan,
      // Model setter handles hashing
      matKhau,
      anhThe: "/uploads/default.png",
      maVT: "U11",
    });
    res.status(201).json(nguoiDung);
  } catch (error) {
    console.error("INSERT REGISTER ERROR:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { maND, tenND, diaChi, ngaySinh, sdt, email, anhThe, maVT } =
      req.body;
    const nguoiDung = await NguoiDung.findByPk(maND);
    if (nguoiDung !== null) {
      await nguoiDung.update({
        tenND,
        diaChi,
        ngaySinh,
        sdt,
        email,
        anhThe,
        maVT,
      });
      res.status(200).json(nguoiDung);
    } else {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const nguoiDung = await NguoiDung.findByPk(req.params.id);
    if (nguoiDung) {
      await nguoiDung.destroy();
      res.status(200).json(nguoiDung);
    } else {
      res.status(404).json({ message: "Người dùng không tồn tại" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const nguoiDungs = await NguoiDung.findAll({
      where: {
        [Op.or]: [
          { tenND: { [Op.like]: `%${req.query.q}%` } },
          { diaChi: { [Op.like]: `%${req.query.q}%` } },
          { email: { [Op.like]: `%${req.query.q}%` } },
          { taiKhoan: { [Op.like]: `%${req.query.q}%` } },
        ],
      },
    });
    res.status(200).json(nguoiDungs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { taiKhoan, matKhauCu, matKhauMoi } = req.body;

    const nguoiDung = await NguoiDung.findOne({ where: { taiKhoan } });
    if (!nguoiDung) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    if (nguoiDung.matKhau !== md5(matKhauCu)) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    // Cập nhật mật khẩu mới (model setter sẽ tự động hash)
    await nguoiDung.update({ matKhau: matKhauMoi });

    res.status(200).json({
      taiKhoan: nguoiDung.taiKhoan,
      message: "Đổi mật khẩu thành công"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
