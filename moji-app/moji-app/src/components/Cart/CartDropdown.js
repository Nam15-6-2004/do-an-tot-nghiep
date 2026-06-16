import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Cart.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const CartDropdown = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const updateCartModal = () => {
      const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCartItems((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(storedCart)) {
          return storedCart;
        }
        return prev;
      });
    };
    
    updateCartModal();
    const interval = setInterval(updateCartModal, 500);
    window.addEventListener("storage", updateCartModal);
    
    return () => {
      window.removeEventListener("storage", updateCartModal);
      clearInterval(interval);
    };
  }, []);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.giaTien * item.quantity,
      0
    );
  };

  const removeItem = (maSP) => {
    const updatedCart = cartItems.filter((item) => item.maSP !== maSP);
    setCartItems(updatedCart);
    const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));

    if (window.location.pathname === "/gio-hang") {
      window.location.reload();
    }
  };
  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3001${imageArray[0]}`;
    }
    if (typeof imageArray === "string" && imageArray.trim() !== "") {
      return `http://localhost:3001${imageArray}`;
    }
    return "/image/default.jpg";
  };

  return (
    <div className="dropdown">
      <div className="dropdown-menu p-3 cart-dropdown">
        {cartItems.length > 0 ? (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div
                  key={`${item.maSP}`}
                  className="cart-item d-flex align-items-center mb-3"
                >
                  <img
                    src={getProductImage(item.anhSP)}
                    alt={item.tenSP}
                    className="cart-item-image me-3"
                  />
                  <div className="cart-item-details flex-grow-1">
                    <p className="cart-item-name mb-1">
                      {item.tenSP}-{item.mauSP}
                    </p>
                    <p className="cart-item-price text-danger mb-1">
                      <strong>Đơn giá: </strong> {item.giaTien.toLocaleString()}
                      đ
                    </p>
                    <p className="cart-item-quantity d-flex justify-content-between mb-0">
                      x{item.quantity}
                      <span
                        className="delete-icon text-secondary"
                        onClick={() => removeItem(item.maSP)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <p className="d-flex justify-content-between">
                <strong>Thành tiền: </strong>
                <span className="cart-total text-danger">
                  {calculateTotalPrice().toLocaleString()}đ
                </span>
              </p>
              <Link to="/gio-hang" className="cart-button btn btn-pink w-100">
                Xem giỏ hàng
              </Link>
            </div>
          </>
        ) : (
          <p className="empty-cart text-center">
            Chưa có sản phẩm nào được thêm
          </p>
        )}
      </div>
    </div>
  );
};

export default CartDropdown;
