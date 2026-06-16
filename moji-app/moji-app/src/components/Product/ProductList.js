import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../services/sanPhamService";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../pages/SanPham/sanPham.scss";
import { getCtCategoryById } from "../../services/danhMucService";

const ProductList = ({ rows, selectedCategory, searchResults }) => {
  const [productList, setProductList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (searchResults && searchResults.length > 0) {
          setProductList(searchResults);
        } else if (selectedCategory) {
          const categoryData = await getCtCategoryById(selectedCategory);
          setProductList(categoryData?.SanPhams || []);
        } else {
          const allProducts = await getAllProducts();
          setProductList(allProducts);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchResults]);

  const displayedProducts = Array.isArray(productList)
    ? productList.slice(0, rows * 4)
    : [];

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3001${imageArray[0]}`;
    }
    return "/image/default.jpg";
  };

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const cartItem = { ...selectedProduct, quantity };

    const cartKey = localStorage.getItem("taiKhoan") ? `gioHang_${localStorage.getItem("taiKhoan")}` : "gioHang";
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

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

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("gioHangUpdated")); // Bắn lên sự kiện để cập nhật UI

    setAddedProduct(cartItem);
    setShowNotification(true);

    setTimeout(() => setShowNotification(false), 3000);

    handleCloseModal();
  };

  const [likedProducts, setLikedProducts] = useState([]);
  const [favoriteNotification, setFavoriteNotification] = useState("");

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("yeuThich")) || [];
    setLikedProducts(storedLikes);
  }, []);

  const handleToggleFavorite = (product) => {
    const existing = likedProducts.find((item) => item.maSP === product.maSP);
    let updatedFavorites;

    if (existing) {
      updatedFavorites = likedProducts.filter(
        (item) => item.maSP !== product.maSP
      );
      setFavoriteNotification("Xóa sản phẩm yêu thích thành công!");
      window.location.reload();
    } else {
      updatedFavorites = [...likedProducts, product];
      setFavoriteNotification("Thêm sản phẩm yêu thích thành công!");
    }

    setLikedProducts(updatedFavorites);
    localStorage.setItem("yeuThich", JSON.stringify(updatedFavorites));

    setTimeout(() => setFavoriteNotification(""), 3000);
  };

  return (
    <div className="container">
      <div className="row">
        {displayedProducts.map((product) => (
          <div key={product.maSP} className="col-md-3 col-sm-6 col-12 mb-4">
            <div className="product-card">
              <Link
                to={`/san-pham/${product.maSP}`}
                className="text-decoration-none text-black"
              >
                <img
                  src={getProductImage(product.anhSP)}
                  alt={product.tenSP}
                  className="img-fluid product-img"
                />
                <h5 className="product-name mt-2">{product.tenSP}</h5>
                {product.soLuong === 0 && (
                  <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                    Hết hàng
                  </span>
                )}
                <p className="product-price">
                  {product.giaTien.toLocaleString("vi-VN")}đ
                </p>
              </Link>
              <div className="card-overlay d-flex justify-content-center align-items-center">
                <span
                  className="icon-wrapper"
                  onClick={() => handleToggleFavorite(product)}
                >
                  <i
                    className={`bi ${
                      likedProducts.some((item) => item.maSP === product.maSP)
                        ? "bi-heart-fill text-danger"
                        : "bi-heart"
                    }`}
                  ></i>
                </span>

                <span className="separator">|</span>
                <span
                  className="icon-wrapper"
                  onClick={() => {
                    if (product.soLuong > 0) {
                      handleShowModal(product);
                    } else {
                      alert("Sản phẩm này hiện đang hết hàng!");
                    }
                  }}
                  style={{ cursor: product.soLuong > 0 ? "pointer" : "not-allowed", opacity: product.soLuong > 0 ? 1 : 0.5 }}
                >
                  <i className="bi bi-cart-fill"></i>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedProduct && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.tenSP}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-6">
                  <img
                    src={getProductImage(selectedProduct.anhSP)}
                    alt={selectedProduct.tenSP}
                    className="img-fluid mb-3"
                  />
                </div>
                <div className="col-md-6">
                  <p>Mã sản phẩm: {selectedProduct.code}</p>
                  <p>
                    Giá:{" "}
                    <span className="text-danger fw-bold">
                      {selectedProduct.giaTien.toLocaleString("vi-VN")}đ
                    </span>
                  </p>
                  <p>Màu sắc: {selectedProduct.mauSP || "Không có"}</p>
                  <div className="quantity-container mt-3">
                    <label className="me-2 mb-0">Số lượng:</label>
                    <button
                      className="btn quantity-btn"
                      onClick={decreaseQuantity}
                    >
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
                    <button
                      className="btn quantity-btn"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button
              style={{
                backgroundColor: "rgba(255, 231, 151, 0.9)",
                borderColor: "#E6CF70",
                color: "#333",
              }}
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {/* Thông báo khi thêm sản phẩm vào giỏ hàng */}
      {showNotification && addedProduct && (
        <div className="cart-notification">
          <img
            src={getProductImage(addedProduct.anhSP)}
            alt={addedProduct.tenSP}
            className="cart-notification-img"
          />
          <p>
            Chúc mừng! Bạn đã thêm thành công sản phẩm{" "}
            <strong>{addedProduct.tenSP}</strong> vào giỏ hàng!
          </p>
        </div>
      )}
      {/* Thông báo khi thêm sản phẩm vào yêu thích */}
      {favoriteNotification && (
        <div className="like-notification d-flex align-items-center">
          <p>{favoriteNotification}</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
