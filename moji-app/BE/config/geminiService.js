const axios = require("axios");
require("dotenv").config();

const chatWithGemini = async (userInput) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userInput }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return (
      response.data.candidates[0]?.content?.parts[0]?.text ||
      "Không có phản hồi."
    );
  } catch (error) {
    console.error("Lỗi Gemini:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { chatWithGemini };
