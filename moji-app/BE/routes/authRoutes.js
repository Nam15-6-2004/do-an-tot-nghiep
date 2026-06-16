const express = require("express");
const { login, googleLogin } = require("../controllers/authController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taiKhoan:
 *                 type: string
 *               matKhau:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Mật khẩu không đúng
 *       404:
 *         description: Tài khoản không tồn tại
 */
router.post("/auth/login", login);
router.post("/auth/google-login", googleLogin);

module.exports = router;
