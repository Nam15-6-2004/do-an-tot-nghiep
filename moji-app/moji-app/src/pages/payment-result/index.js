import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBill } from "../../services/hoaDonBanService";

export default function PaymentResultPage() {
  const location = useLocation();
  const navigate = useNavigate(); //
  const queryParams = new URLSearchParams(location.search);

  const responseCode = queryParams.get("vnp_ResponseCode");
  const transactionStatus = queryParams.get("vnp_TransactionStatus");
  const amount = queryParams.get("vnp_Amount");
  const bankCode = queryParams.get("vnp_BankCode");
  const bankTranNo = queryParams.get("vnp_BankTranNo");
  const cardType = queryParams.get("vnp_CardType");
  const orderInfo = queryParams.get("vnp_OrderInfo");
  const payDate = queryParams.get("vnp_PayDate");
  const txnRef = queryParams.get("vnp_TxnRef");
  const transactionNo = queryParams.get("vnp_TransactionNo");
  const [status, setStatus] = useState("Đang xử lý...");

  useEffect(() => {
    const createOrder = async () => {
      const orderData = JSON.parse(localStorage.getItem("orderData"));

      if (orderData) {
        try {
          await createBill(orderData);
          setStatus("Thanh toán thành công! Xem thông tin đơn hàng.");
          localStorage.removeItem("orderData");
          const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
          localStorage.removeItem(cartKey);
        } catch (error) {
          console.error("Tạo hóa đơn thất bại:", error);
          setStatus("Thanh toán thành công nhưng tạo hóa đơn thất bại.");
        }
      } else {
        setStatus("Không tìm thấy thông tin đơn hàng.");
      }
    };

    if (responseCode === "00") {
      createOrder();
    } else {
      setStatus("Thanh toán thất bại hoặc bị hủy.");
    }
  }, [responseCode]);

  // Chuyển đổi số tiền từ đơn vị nhỏ sang VND
  const formattedAmount = (Number(amount) / 100).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Định dạng ngày thanh toán
  const formattedDate = payDate
    ? `${payDate.slice(6, 8)}/${payDate.slice(4, 6)}/${payDate.slice(
        0,
        4
      )} ${payDate.slice(8, 10)}:${payDate.slice(10, 12)}:${payDate.slice(
        12,
        14
      )}`
    : "";

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ color: responseCode === "00" ? "green" : "red" }}>
        {responseCode === "00"
          ? "Thanh toán thành công"
          : "Thanh toán thất bại"}
      </h2>
      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "10px",
          background: "#f9f9f9",
        }}
      >
        <p>
          <strong>Mã giao dịch:</strong> {txnRef}
        </p>
        <p>
          <strong>Mã thanh toán VNPAY:</strong> {transactionNo}
        </p>
        <p>
          <strong>Số tiền:</strong> {formattedAmount}
        </p>
        <p>
          <strong>Ngân hàng:</strong> {bankCode}
        </p>
        <p>
          <strong>Số tham chiếu ngân hàng:</strong> {bankTranNo}
        </p>
        <p>
          <strong>Loại thẻ:</strong> {cardType}
        </p>
        <p>
          <strong>Thông tin đơn hàng:</strong>{" "}
          {decodeURIComponent(orderInfo || "")}
        </p>
        <p>
          <strong>Thời gian thanh toán:</strong> {formattedDate}
        </p>
        <p>
          <strong>Trạng thái giao dịch:</strong>{" "}
          {transactionStatus === "00" ? "Thành công" : "Thất bại"}
        </p>
      </div>
      {status && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: responseCode === "00" ? "#e6f7e6" : "#f8d7da",
            color: responseCode === "00" ? "#2d662d" : "#842029",
            borderRadius: "5px",
            border:
              responseCode === "00" ? "1px solid #b6e6b6" : "1px solid #f5c2c7",
          }}
        >
          {status}
        </div>
      )}

      {responseCode !== "00" ? (
        <button
          className="btn btn-danger mt-3"
          onClick={() => navigate("/thanh-toan")}
          style={{ width: "100%" }}
        >
          Quay lại trang thanh toán
        </button>
      ) : (
        <button
          className="btn btn-success mt-3"
          onClick={() => navigate("/ho-so/ls-don-hang")}
          style={{ width: "100%" }}
        >
          Đơn hàng của bạn
        </button>
      )}
    </div>
  );
}
