import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./thanhToan.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/nguoiDungService";
import { createBill } from "../../services/hoaDonBanService";
import { createPaymentUrl } from "../../services/vnPayService";
import { sendEmail } from "../../services/sendEmailService";
function ThanhToan() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];
  const [nguoiDung, setNguoiDung] = useState({});
  const [phuongThuc, setPhuongThuc] = useState("Thanh toán khi nhận hàng");
  const [voucher, setVoucher] = useState("");
  const [giamTien, setGiamTien] = useState(0);
  const [dieuKhoan, setDieuKhoan] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  //const [ghiChu, setGhiChu] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const username = localStorage.getItem("taiKhoan");
      const allUser = await getAllUsers();
      const user = allUser.find((user) => user.taiKhoan === username);
      if (user) {
        setNguoiDung(user);
      }
    };

    fetchUser();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.giaTien * item.quantity,
    0
  );
  const handleDiscount = () => {
    switch (voucher) {
      case "moji10k":
        setGiamTien(10000);
        break;
      case "moji20k":
        setGiamTien(20000);
        break;
      case "moji50k":
        setGiamTien(50000);
        break;
      default:
        setGiamTien(0);
        alert("Mã giảm giá không hợp lệ");
    }
  };

  const detailProduct = cartItems.length === 1;

  const handlePayment = async () => {
    if (!dieuKhoan) {
      alert("Vui lòng đồng ý với các điều khoản trước khi thanh toán.");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        giamGia: giamTien,
        phuongThuc: phuongThuc,
        maND: nguoiDung.maND,
        CTHoaDonBans: detailProduct
          ? [{ maSP: cartItems[0].maSP, soLuong: cartItems[0].quantity }]
          : cartItems.map((item) => ({
              maSP: item.maSP,
              soLuong: item.quantity,
            })),
      };

      if (phuongThuc === "Thanh toán khi nhận hàng") {
        const data = await createBill(orderData);
        if (data) {
          // Tạo map để lưu thông tin sản phẩm từ cartItems
          const cartItemsMap = {};
          cartItems.forEach((item) => {
            cartItemsMap[item.maSP] = item;
          });

          // Gửi email hóa đơn cho khách hàng
          const emailTemplate = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              @page { size: A4; margin: 2cm; }
              body { width: 210mm; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.3; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 8px; border: 1px solid #dee2e6; }
              th { background-color: #f8f9fa; text-align: center; }
              .product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
              <h2 style="color: #2c3e50; margin: 0; font-size: 24pt;">NLSHOP</h2>
              <h3 style="color: #34495e; margin: 10px 0; font-size: 18pt;">HÓA ĐƠN BÁN HÀNG</h3>
              <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
              <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@nlshop.com</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: none;">
              <tr>
                <td style="width: 48%; padding: 15px; vertical-align: top; border: none;">
                  <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin hóa đơn</h4>
                  <p><strong>Mã hóa đơn:</strong> #${data.maHDB || ""}</p>
                  <p><strong>Ngày bán:</strong> ${
                    data.ngayBan
                      ? new Date(data.ngayBan).toLocaleDateString("vi-VN")
                      : ""
                  }</p>
                  <p><strong>Phương thức:</strong> ${data.phuongThuc || ""}</p>
                </td>
                <td style="width: 48%; padding: 15px; vertical-align: top; border: none;">
                  <h4 style="color: #2c3e50; margin: 0 0 10px 0;">Thông tin khách hàng</h4>
                  <p><strong>Họ tên:</strong> ${nguoiDung.tenND || ""}</p>
                  <p><strong>Số điện thoại:</strong> ${nguoiDung.sdt || ""}</p>
                  <p><strong>Email:</strong> ${nguoiDung.email || ""}</p>
                  <p><strong>Địa chỉ:</strong> ${nguoiDung.diaChi || ""}</p>
                </td>
              </tr>
            </table>
            <table>
              <thead>
                <tr>
                  <th style="width: 5%;">STT</th>
                  <th style="width: 15%;">Hình ảnh</th>
                  <th style="width: 35%;">Sản phẩm</th>
                  <th style="width: 15%;">Đơn giá</th>
                  <th style="width: 10%;">Số lượng</th>
                  <th style="width: 20%;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${data.CTHoaDonBans?.map((item, idx) => {
                  const cartItem = cartItemsMap[item.maSP] || {};
                  return `
                      <tr>
                        <td style="text-align: center;">${idx + 1}</td>
                        <td style="text-align: center;">
                          <img src="http://localhost:3001${
                            cartItem.anhSP || ""
                          }" class="product-image" alt="${
                    cartItem.tenSP || ""
                  }"/>
                        </td>
                        <td>${cartItem.tenSP || ""} - ${
                    cartItem.mauSP || ""
                  }</td>
                        <td style="text-align: right;">${
                          cartItem.giaTien
                            ? cartItem.giaTien.toLocaleString("vi-VN")
                            : "0"
                        }đ</td>
                        <td style="text-align: center;">${
                          item.soLuong || "0"
                        }</td>
                        <td style="text-align: right;">${(
                          cartItem.giaTien * item.soLuong
                        ).toLocaleString("vi-VN")}đ</td>
                      </tr>
                    `;
                }).join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="5" style="text-align: right;"><strong>Tổng cộng:</strong></td>
                  <td style="text-align: right;"><strong>${
                    data.tongTien?.toLocaleString("vi-VN") || 0
                  }đ</strong></td>
                </tr>
              </tfoot>
            </table>
            <div style="margin-top: 50px; text-align: center;">
              <table style="width: 100%; border: none;">
                <tr>
                  <td style="width: 50%; border: none; text-align: center;">
                    <p style="margin: 0;"><strong>Người mua hàng</strong></p>
                    <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                  </td>
                  <td style="width: 50%; border: none; text-align: center;">
                    <p style="margin: 0;"><strong>Người bán hàng</strong></p>
                    <p style="color: #666; font-style: italic;">(Ký, ghi rõ họ tên)</p>
                    <div style="height: 80px;"></div>
                  </td>
                </tr>
              </table>
            </div>
            <div style="margin-top: 30px; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
              <p style="margin: 5px 0;">Cảm ơn quý khách đã tin tưởng và mua sắm tại NLSHOP!</p>
              <p style="margin: 5px 0;">Hotline: 0123.456.789 | Email: contact@nlshop.com</p>
              <p style="margin: 5px 0;">Địa chỉ: 97 Đường Man Thiện, Hiệp Phú, TP.Thủ Đức</p>
            </div>
          </body>
          </html>
          `;
          // Chạy ngầm việc gửi email để không bắt người dùng phải đợi
          sendEmail({
            emailTo: nguoiDung.email,
            billHtml: emailTemplate,
            orderId: data.maHDB,
          }).catch((err) => console.log("Lỗi gửi email:", err));
          
          // Tạo độ trễ ảo 1 giây để người dùng đọc kịp chữ "Đang xử lý..." tạo cảm giác an tâm
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          alert("thanh toán thành công");
          const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
          localStorage.removeItem(cartKey);
          navigate("/ho-so/ls-don-hang");
        }
      } else if (phuongThuc === "Chuyển khoản trực tiếp") {
        const tongTienSauGiam = total - giamTien;
        const res = await createPaymentUrl({
          amount: tongTienSauGiam,
        });
        const paymentUrl = res?.data?.paymentUrl || res?.paymentUrl;
        if (paymentUrl) {
          localStorage.setItem("orderData", JSON.stringify(orderData));
          window.location.href = paymentUrl;
        } else {
          console.error("Không tìm thấy link thanh toán:", res);
          alert("Không thể tạo link thanh toán.");
        }
      }
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-page container mt-4">
      <div className="row">
        <div className="col-md-4">
          <h5 className="section-title">
            <span className="step-number">1</span> Thông tin người nhận
          </h5>
          <form>
            <input
              type="text"
              className="form-control"
              placeholder="Họ tên *"
              defaultValue={nguoiDung.tenND}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Điện thoại *"
              defaultValue={nguoiDung.sdt}
            />
            <input
              type="email"
              className="form-control"
              placeholder="Email *"
              defaultValue={nguoiDung.email}
            />

            <input
              type="text"
              className="form-control"
              placeholder="Địa chỉ chi tiết *"
              defaultValue={nguoiDung.diaChi}
            />

            <textarea
              className="form-control"
              rows={3}
              id="ghiChu"
              placeholder="Ghi chú"
              defaultValue={""}
              //value={ghiChu}
              //onChange={(e) => setGhiChu(e.target.value)}
            />
          </form>
          <p className="note">
            Đơn hàng trên website được xử lý trong giờ hành chính. Vui lòng liên
            hệ fanpage ngoài khung giờ trên để được hỗ trợ.
            <br />
            Đơn hàng Moji không đồng kiểm khi giao hàng. Khách hàng vui lòng
            quay video khi bóc hàng để được hỗ trợ tốt nhất nếu xảy ra vấn đề.
          </p>
        </div>
        <div className="col-md-4">
          <h5 className="section-title">
            <span className="step-number">2</span> Phương thức thanh toán
          </h5>
          <div className="bordered-box">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="bankTransfer"
                checked={phuongThuc === "Chuyển khoản trực tiếp"}
                onChange={() => setPhuongThuc("Chuyển khoản trực tiếp")}
              />
              <label className="form-check-label" htmlFor="bankTransfer">
                Chuyển khoản trước toàn bộ tiền hàng
              </label>
            </div>
            <div className="highlight-box">
              <p>
                Với phương thức Chuyển khoản trước toàn bộ tiền hàng, bộ phận
                CSKH sẽ gọi điện đến bạn để xác nhận đơn hàng và hướng dẫn cách
                thức thanh toán chuyển khoản.
              </p>
            </div>
            <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cod"
                checked={phuongThuc === "Thanh toán khi nhận hàng"}
                onChange={() => setPhuongThuc("Thanh toán khi nhận hàng")}
              />
              <label className="form-check-label" htmlFor="cod">
                Thanh toán khi nhận hàng
              </label>
            </div>
            <div className="highlight-box">
              <p>
                Thanh toán khi nhận hàng (COD) chỉ áp dụng cho các đơn hàng ở
                các quận/huyện dưới đây thuộc Hà Nội/TP.HCM:
              </p>
              <p>
                {""}+ Hà Nội: Quận Hoàn Kiếm, Ba Đình, Đống Đa, Hoàng Mai, Hai
                Bà Trưng, Cầu Giấy, Thanh Xuân, Tây Hồ, Từ Liêm, Hà Đông, Long
                Biên, Gia Lâm, Sơn Tây, Ba Vì, Mê Linh, Đông Anh, Thường Tín,
                Thanh Trì
              </p>
              <p>
                + HCM: Quận 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, Tân Bình, Tân
                Phú, Phú Nhuận, Bình Thạnh, Gò Vấp, Bình Tân, Thủ Đức, Bình
                Chánh, Nhà Bè, Hooc Môn
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <h5 className="section-title">
            <span className="step-number">3</span> Thông tin giỏ hàng
          </h5>

          {/* Bảng sản phẩm */}
          <table className="table">
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.maSP}>
                  <td>
                    {item.tenSP}-{item.mauSP}
                    <div className="product-price">
                      Đơn giá: <strong>{item.giaTien.toLocaleString()}đ</strong>
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>
                    <strong>
                      {(item.giaTien * item.quantity).toLocaleString()}đ
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bảng tổng tiền */}
          <table className="table">
            <tbody>
              <tr>
                <td>Tạm tính</td>
                <td>{total.toLocaleString()}đ</td>
              </tr>
              <tr>
                <td>Phí vận chuyển</td>
                <td>0đ</td>
              </tr>
              <tr>
                <td>Mã giảm giá</td>
                <td>{giamTien.toLocaleString()}đ</td>
              </tr>
              <tr>
                <td>
                  <strong>Tổng cộng</strong>
                </td>
                <td>
                  <strong>{(total - giamTien).toLocaleString()}đ</strong>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Ô nhập mã giảm giá */}
          <div className="input-group mb-3 discount-box">
            <input
              type="text"
              className="form-control"
              placeholder="Mã giảm giá"
              value={voucher || ""}
              onChange={(e) => setVoucher(e.target.value)}
            />
            <button
              className="btn btn-pink apDung"
              onClick={handleDiscount}
              type="button"
            >
              Áp dụng
            </button>
          </div>

          {/* Điều khoản */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms"
              checked={dieuKhoan}
              onChange={() => setDieuKhoan(!dieuKhoan)}
            />
            <label className="form-check-label" htmlFor="terms">
              Tôi đồng ý với các điều khoản{" "}
              <Link
                to="#"
                className="text-decoration-none"
                style={{ color: "#0d6efd" }}
              >
                chính sách giao hàng
              </Link>
            </label>
          </div>

          {/* Nút Thanh toán */}
          <div className="text-end">
            <button
              className="btn btn-pink thanhToan"
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Thanh toán"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ThanhToan;
