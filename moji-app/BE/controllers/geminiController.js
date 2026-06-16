const { chatWithGemini } = require("../config/geminiService");
const SanPham = require("../models/sanPhamModel");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Thiếu nội dung tin nhắn" });

    const reply = await chatWithGemini(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server", detail: error.message });
  }
};

// Hàm lấy danh sách sản phẩm cho Gemini
const getAllProductsForGemini = async (req, res) => {
  try {
    const products = await SanPham.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy dữ liệu sản phẩm" });
  }
};

module.exports = { handleChat, getAllProductsForGemini };
