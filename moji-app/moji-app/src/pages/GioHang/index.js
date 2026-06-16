import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./gioHang.scss";
import { useNavigate } from "react-router-dom";

function GioHang() {
  const [cartItems, setCartItems] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(storedCart);
  }, []);

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3001${imageArray[0]}`;
    }
    return "/image/default.jpg";
  };
  // Cập nhật số lượng
  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.maSP === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );

    setCartItems(updatedCart);
    const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  //  tổng tiền
  const total = cartItems.reduce(
    (sum, item) => sum + item.giaTien * item.quantity,
    0
  );
  // Xóa sản phẩm
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.maSP !== id);
    setCartItems(updatedCart);
    console.log("xóa", updatedCart);
    const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    Navigate("/thanh-toan", { state: { cartItems } });
  };
  // table-bordered table-striped table-bordered table-hover
  return (
    <div className="container mt-5 cart-container">
      {console.log("====> DỮ LIỆU ĐANG RENDER Ở GIỎ HÀNG:", cartItems)}
      <table className="table">
        <thead className="table-bordered">
          <tr>
            <th>Sản phẩm</th>
            <th>Mô tả</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.maSP}>
              <td>
                <img
                  src={getProductImage(item.anhSP)}
                  alt={item.tenSP}
                  className="img-fluid img-cart"
                />
              </td>
              <td className="hover-name">
                {item.tenSP} - {item.mauSP}
              </td>
              <td>{item.giaTien.toLocaleString()}đ</td>
              <td className="text-center">
                <div className="d-flex align-items-center justify-content-center">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.maSP, item.quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    readOnly
                    className="quantity-input"
                  />
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => updateQuantity(item.maSP, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>

              <td>{(item.giaTien * item.quantity).toLocaleString()}đ</td>
              <td>
                <button
                  className="btn-xoa"
                  onClick={() => removeItem(item.maSP)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note">
        <p>Lưu ý:</p>
        <p>Đơn hàng trên website được xử lý trong giờ hành chính</p>
        <p>
          Đơn hàng NL Shop không đồng kiểm khi giao hàng. Khách hàng vui lòng quay
          video khi bóc hàng để được hỗ trợ tốt nhất nếu xảy ra vấn đề.
        </p>
      </div>
      <div className="mt-4 mb-5 d-flex flex-column align-items-end">
        <span className="total" style={{ marginRight: "130px" }}>
          Tổng: {total.toLocaleString()}đ
        </span>
        <div className="mt-2">
          <button
            className="btn btn-custom"
            onClick={() => Navigate("/san-pham")}
          >
            Tiếp tục mua sắm
          </button>
          <button
            className="btn btn-custom btn-thanhToan"
            onClick={handleCheckout}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default GioHang;
