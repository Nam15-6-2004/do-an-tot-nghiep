// const express = require("express");
// const cors = require("cors");
// const sequelize = require("./config/database");
// const setupSwagger = require("./config/swagger");
// const danhMucRoutes = require("./routes/danhMucRoutes");
// const sanPhamRoutes = require("./routes/sanPhamRoutes");
// const vaiTroRoutes = require("./routes/vaiTroRoutes");
// const nguoiDungRoutes = require("./routes/nguoiDungRoutes");
// const nhaCungCapRoutes = require("./routes/nhaCungCapRoutes");
// const authRoutes = require("./routes/authRoutes");
// const upLoadRoutes = require("./routes/upLoadRoutes");
// const hoaDonNhapRoutes = require("./routes/hoaDonNhapRoutes");
// const hoaDonBanRoutes = require("./routes/hoaDonBanRoutes");

// //const payOSRoutes = require("./routes/payosRoutes");
// const { PORT } = require("./config/config");

// const app = express();
// require("dotenv").config();
// const geminiRoutes = require("./routes/geminiRoutes");
// const vnpayRoute = require("./routes/vnpayRoutes");
// const emailRoutes = require("./routes/emailRoutes");

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json());

// app.use("/api", geminiRoutes);
// app.use("/api", vnpayRoute);

// app.use("/uploads", express.static("public/uploads"));

// app.use("/api", danhMucRoutes);
// app.use("/api", sanPhamRoutes);
// app.use("/api", vaiTroRoutes);
// app.use("/api", nguoiDungRoutes);
// app.use("/api", nhaCungCapRoutes);
// app.use("/api", authRoutes);
// app.use("/api", upLoadRoutes);
// app.use("/api", hoaDonNhapRoutes);
// app.use("/api", hoaDonBanRoutes);
// app.use("/api", emailRoutes);
// //app.use("/api", payOSRoutes);

// // Thiết lập Swagger
// setupSwagger(app);

// sequelize
//   .sync() // { force: true } { alter: true }
//   .then(() => {
//     console.log("Kết nối database thành công");
//     app.listen(PORT, () => {
//       console.log(`Máy chủ đang chạy tại: http://localhost:${PORT}/api-docs/`);
//     });
//   })
//   .catch((error) => {
//     console.error("Lỗi kết nối database", error);
//   });

// module.exports = app;

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const setupSwagger = require("./config/swagger");

// Routes
const danhMucRoutes = require("./routes/danhMucRoutes");
const sanPhamRoutes = require("./routes/sanPhamRoutes");
const vaiTroRoutes = require("./routes/vaiTroRoutes");
const nguoiDungRoutes = require("./routes/nguoiDungRoutes");
const nhaCungCapRoutes = require("./routes/nhaCungCapRoutes");
const authRoutes = require("./routes/authRoutes");
const upLoadRoutes = require("./routes/upLoadRoutes");
const hoaDonNhapRoutes = require("./routes/hoaDonNhapRoutes");
const hoaDonBanRoutes = require("./routes/hoaDonBanRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const vnpayRoute = require("./routes/vnpayRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();

// ✅ FIX CORS (hỗ trợ localhost + ngrok an toàn hơn)
const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép request không có origin (như curl, mobile app) hoặc trong whitelist, hoặc domain ngrok
      if (!origin || whitelist.indexOf(origin) !== -1 || origin.includes("ngrok-free.dev")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Static
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api", geminiRoutes);
app.use("/api", vnpayRoute);
app.use("/api", danhMucRoutes);
app.use("/api", sanPhamRoutes);
app.use("/api", vaiTroRoutes);
app.use("/api", nguoiDungRoutes);
app.use("/api", nhaCungCapRoutes);
app.use("/api", authRoutes);
app.use("/api", upLoadRoutes);
app.use("/api", hoaDonNhapRoutes);
app.use("/api", hoaDonBanRoutes);
app.use("/api", emailRoutes);

// Swagger
setupSwagger(app);

// ✅ GLOBAL ERROR HANDLER (Chống crash vĩnh viễn)
app.use((err, req, res, next) => {
  console.error("💥 GLOBAL ERROR:", err);
  res.status(500).json({
    message: "Hệ thống gặp lỗi, vui lòng thử lại sau!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// ✅ PORT chuẩn
const PORT = process.env.PORT || 3001;

// ✅ START SERVER (fix crash + nodemon double listen)
let server;
async function startServer() {
  try {
    await sequelize.sync();
    console.log("✅ Kết nối database thành công");

    if (!server) {
      server = app.listen(PORT, () => {
        console.log(`🚀 Server chạy tại: http://localhost:${PORT}/api-docs/`);
      });
    }
  } catch (error) {
    console.error("❌ Lỗi kết nối database:", error);
  }
}

startServer();

// ✅ FIX CRASH 100% (debug lỗi ẩn)
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION:", err);
});

module.exports = app;