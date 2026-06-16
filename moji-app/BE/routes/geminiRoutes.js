const express = require("express");
const router = express.Router();
const {
  handleChat,
  getAllProductsForGemini,
} = require("../controllers/geminiController");

router.post("/gemini/chat", handleChat);
//router.get("/gemini/products", getAllProductsForGemini);
router.get("/gemini/chatProduct", getAllProductsForGemini);
module.exports = router;
