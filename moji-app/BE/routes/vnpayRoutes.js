const express = require("express");
const router = express.Router();
const { createPaymentUrl } = require("../controllers/vnpayController");

router.post("/vn_pay/create_payment_url", createPaymentUrl);

module.exports = router;
