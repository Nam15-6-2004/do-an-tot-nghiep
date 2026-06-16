// const PayOS = require("@payos/node");
// const dotenv = require("dotenv");
// dotenv.config();
// const payOS = new PayOS(
//   process.env.PAYOS_CLIENT_ID,
//   process.env.PAYOS_API_KEY,
//   process.env.PAYOS_CHECKSUM_KEY
// );

// async function taoLink(data) {
//   const body = {
//     orderCode: Math.floor(Math.random() * 10000),
//     ...data,
//     cancelUrl: "http://localhost:3000/cancel",
//     returnUrl: "http://localhost:3000/success",
//   };
//   try {
//     const paymentLinkRes = await payOS.createPaymentLink(body);
//     return paymentLinkRes;
//   } catch (error) {
//     console.error("Error creating payment link:", error);
//     throw new Error("Failed to create payment link");
//   }
// }

// module.exports = {
//   taoLink,
// };
