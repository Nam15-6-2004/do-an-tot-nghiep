// async function create(req, res) {
//   const { data } = req.body;
//   try {
//     const paymentLinkRes = await taoLink(data);
//     res.status(200).json(paymentLinkRes);
//   } catch (error) {
//     console.error("Error creating payment link:", error);
//     res.status(500).json({ message: "Failed to create payment link" });
//   }
// }

// const payOsController = {
//   create,
// };

// module.exports = payOsController;
