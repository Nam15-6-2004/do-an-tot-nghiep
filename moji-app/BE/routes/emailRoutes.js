const express = require("express");
const { sendBillEmail } = require("../controllers/emailController");
const router = express.Router();

router.post("/email/send-bill", sendBillEmail);

module.exports = router;
