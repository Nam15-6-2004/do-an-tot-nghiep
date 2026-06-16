import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../services/sanPhamService";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../pages/SanPham/sanPham.scss";
import ProductList from "../Product/ProductList";
import Chat from "../chat";

function ProductDetail() {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedProduct, setAddedProduct] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setMainImage(
          `http://localhost:3001${data.anhSP?.[0] || "/image/default.jpg"}`
        );
        setSelectedProduct({
          maSP: data.maSP,
          tenSP: data.tenSP,
          giaTien: data.giaTien,
          anhSP: data.anhSP || "/image/default.jpg",
          quantity: 1,
          mauSP: data.mauSP,
        });
      } catch (error) {
        console.log("Lỗi lấy data chi tiết sản phẩm: ", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    // Cập nhật lại thông tin sản phẩm với số lượng và màu sắc (nếu có)
    const cartItem = { ...selectedProduct, quantity };
    console.log("Sản phẩm thêm vào giỏ:", cartItem);

    const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    console.log("Giỏ hàng trước khi thêm:", existingCart);

    const existingProductIndex = existingCart.findIndex(
      (item) => item.maSP === selectedProduct.maSP
    );

    let updatedCart;
    if (existingProductIndex !== -1) {
      existingCart[existingProductIndex].quantity += quantity;
      updatedCart = [...existingCart];
    } else {
      updatedCart = [...existingCart, cartItem];
    }
    console.log("Giỏ hàng sau khi thêm:", updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("gioHangUpdated"));

    setAddedProduct(cartItem);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  const handleBuyNow = () => {
    if (!selectedProduct) return;
    console.log("Sản phẩm đã chọn thanh toán :", selectedProduct);
    console.log("Số lượng thanh toán :", quantity);

    Navigate("/thanh-toan", {
      state: { cartItems: [{ ...selectedProduct, quantity }] },
    });
  };

  if (!product) return <p className="text-center">Đang tải...</p>;

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="caption d-flex">
            <Link to="/">Trang chủ</Link>
            <span className="muiTen mx-2">{">"}</span>
            <Link to="/san-pham">Sản phẩm</Link>
            <span className="muiTen mx-2">{">"}</span>
            <p className="titleDetail">Thông tin chi tiết</p>
          </div>
        </div>
        <div className="row mt-2">
          <div className="product-container">
            {/* Cột trái - Hình ảnh */}
            <div className="col-md-6">
              <div className="main-image-container">
                <img
                  src={mainImage}
                  alt={product.tenSP}
                  className="main-image img-fluid rounded"
                />
              </div>
              <div className="thumbnail-container">
                {product.anhSP?.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3001${image}`}
                    alt={`Ảnh ${index + 1}`}
                    className={`thumbnail ${mainImage === `http://localhost:3001${image}`
                        ? "active"
                        : ""
                      }`}
                    onClick={() =>
                      setMainImage(`http://localhost:3001${image}`)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Cột phải - Thông tin sản phẩm */}
            <div className="col-md-6">
              <div className="product-header">
                <h2 className="product-title">{product.tenSP}</h2>
                <div className="product-icons">
                  <i className="bi bi-share-fill"></i>
                  <i className="bi bi-heart"></i>
                </div>
              </div>

              <p className="product-code">Mã sản phẩm: {product.code}</p>
              <h4 className="text-danger product-price">
                {product.giaTien.toLocaleString("vi-VN")}đ
              </h4>
              {product.soLuong === 0 && (
                <div className="alert alert-danger py-2 mt-2">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Sản phẩm này hiện đang hết hàng
                </div>
              )}

              {/* Hiển thị màu sắc */}
              <div className="product-options">
                <label className="color-label">Màu sắc: </label>
                <span className="color-text ms-3"> {product.mauSP}</span>
              </div>

              {/* Chọn số lượng */}
              <div className="quantity-container mt-3">
                <label className="me-3">Số lượng:</label>
                <button className="btn quantity-btn" onClick={decreaseQuantity}>
                  -
                </button>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  readOnly
                  style={{
                    width: "36px",
                    borderRadius: "5px",
                    textAlign: "center",
                    border: "none",
                    outline: "none",
                  }}
                />
                <button className="btn quantity-btn" onClick={increaseQuantity}>
                  +
                </button>
              </div>

              {/* Nút thao tác */}
              <div className="d-flex gap-3 mt-3">
                <button
                  className="btn-sanPham btn-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.soLuong === 0}
                  style={{ opacity: product.soLuong === 0 ? 0.6 : 1, cursor: product.soLuong === 0 ? "not-allowed" : "pointer" }}
                >
                  <i className="bi bi-cart-plus"></i> {product.soLuong === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                </button>
                <button
                  className="btn-sanPham btn-buy-now"
                  onClick={handleBuyNow}
                  disabled={product.soLuong === 0}
                  style={{ opacity: product.soLuong === 0 ? 0.6 : 1, cursor: product.soLuong === 0 ? "not-allowed" : "pointer" }}
                >
                  <i className="bi bi-bag-check"></i> {product.soLuong === 0 ? "Hết hàng" : "Mua ngay"}
                </button>
              </div>

              <hr />
              {/* Thông tin giao hàng */}
              <div className="shipping-info mt-3 p-3 rounded">
                <div className="row">
                  <div className="col-md-4 d-flex align-items-center">
                    <i className="bi bi-truck me-2 text-danger fs-4"></i>
                    <p className="m-0">
                      Giao toàn quốc <br />
                      đơn hàng từ 99k
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center">
                    <i className="bi bi-cash-stack me-2 text-danger fs-4"></i>
                    <p className="m-0">
                      COD nội thành <br /> HN, HCM
                    </p>
                  </div>
                  <div className="col-md-4 d-flex align-items-center">
                    <i className="bi bi-arrow-repeat me-2 text-danger fs-4"></i>
                    <p className="m-0">Đổi trả trong 24h</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-md-12 d-flex align-items-start">
                    <i className="bi bi-gift me-2 text-danger fs-4"></i>
                    <p className="m-0">
                      Hỗ trợ ship 20k cho đơn từ 300k nội thành HN, HCM <br />
                      Hỗ trợ ship 30k cho đơn từ 500k các khu vực khác
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="moTa mt-5 d-flex flex-column align-items-center">
          <h4>Mô tả sản phẩm</h4>
          <p>{product.moTa}</p>
          {product.anhSP?.slice(0, 2).map((image, index) => (
            <img
              key={index}
              src={`http://localhost:3001${image}`}
              alt={`Chi tiết ${index + 1}`}
              className="img-fluid my-3"
              style={{ width: "100%", borderRadius: "8px" }}
            />
          ))}
        </div>
        {/*thông báo */}
        {showNotification && addedProduct && (
          <div className="cart-notification">
            <img
              src={`http://localhost:3001${addedProduct.anhSP[0]}`}
              alt={addedProduct.tenSP}
              className="cart-notification-img"
            />
            <p>
              Chúc mừng! Bạn đã thêm thành công sản phẩm{" "}
              <strong>{addedProduct.tenSP}</strong> vào giỏ hàng!
            </p>
          </div>
        )}
      </div>

      <div className="container my-5">
        <h5 className="m-0 mb-4">CÁC SẢN PHẨM ĐÃ XEM</h5>
        <div className="carousel-container d-flex align-items-center">
          <button className="carousel-btn left-btn">&#10094;</button>

          <div className="w-100">
            <ProductList rows={1} />
          </div>

          <button className="carousel-btn right-btn">&#10095;</button>
        </div>
      </div>
      <Chat />
    </>
  );
}

export default ProductDetail;
