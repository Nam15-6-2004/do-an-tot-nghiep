import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

function YeuThich() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("yeuThich")) || [];
    setFavorites(storedFavorites);
  }, []);

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
    <div className="content">
      <h5 className="fw-bold">Sản Phẩm Yêu Thích</h5>
      <p className="description mb-3">
        Hãy <i className="bi bi-heart-fill" style={{ color: "#FFE797" }} /> sản
        phẩm bạn yêu thích để xem thuận tiện hơn
      </p>
      <hr />

      {/* Nếu không có sản phẩm yêu thích */}
      {favorites.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            backgroundColor: "#FFF3CD",
            padding: "5px",
            borderRadius: "5px",
            color: "#896604",
          }}
        >
          Danh sách sản phẩm yêu thích của bạn hiện tại không có sản phẩm nào !
        </div>
      ) : (
        <div className="container-fluid yeuthich">
          <div className="row mt-4">
            {favorites.map((product) => (
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
                    <h5 className="product-name name_yt mt-2">
                      {product.tenSP}
                    </h5>
                    <p className="product-price gia_yt">
                      {product.giaTien.toLocaleString("vi-VN")}đ
                    </p>
                  </Link>
                  <div className="card-overlay icon_yt">
                    <span
                      className="icon-wrapper icon_item_yt"
                      onClick={() => handleToggleFavorite(product)}
                    >
                      <i
                        className={`bi ${
                          likedProducts.some(
                            (item) => item.maSP === product.maSP
                          )
                            ? "bi-heart-fill text-danger"
                            : "bi-heart"
                        }`}
                      ></i>
                    </span>
                    <span className="separator">|</span>
                    <span
                      className="icon-wrapper icon_item_yt"
                      onClick={() => handleShowModal(product)}
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
      )}

      <div className="d-flex justify-content-center mt-3 btn_yt">
        <button
          className="btn btn-custom"
          onClick={() => navigate("/san-pham")}
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}

export default YeuThich;
