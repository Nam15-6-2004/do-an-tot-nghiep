import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SanPhamAdmin.scss";
import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  searchProducts,
  updateProduct,
} from "../../../services/sanPhamService";
import {
  getAllCtCategory,
  getCtCategoryById,
} from "../../../services/danhMucService";

function SanPhamAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);
  const [formData, setFormData] = useState({
    tenSP: "",
    code: "",
    mauSP: "",
    moTa: "",
    soLuong: "",
    giaTien: "",
    ma_CTDM: "",
    anhSP: [],
  });

  const resetFormData = () => {
    setFormData({
      tenSP: "",
      code: "",
      mauSP: "",
      moTa: "",
      soLuong: "",
      giaTien: "",
      ma_CTDM: "",
      anhSP: [],
    });
  };

  const validateForm = (formData) => {
    if (
      !formData.tenSP ||
      !formData.code ||
      !formData.mauSP ||
      !formData.moTa ||
      !formData.ma_CTDM ||
      !formData.giaTien ||
      formData.giaTien <= 0
    ) {
      return false;
    }
    return true;
  };

  // chọn ảnh
  const [previewUrls, setPreviewUrls] = useState([]);

  // Hàm upload nhiều ảnh
  const handleFilesSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Preview nhiều ảnh
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Upload nhiều ảnh lên server
    const formDataUpload = new FormData();
    files.forEach((file) => {
      formDataUpload.append("images", file);
    });
    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      if (!response.ok) throw new Error("Upload ảnh thất bại");
      const data = await response.json();
      const imagePaths = data.imageUrls || [];
      setFormData((prev) => ({
        ...prev,
        anhSP: imagePaths,
      }));
    } catch (err) {
      alert("Lỗi upload ảnh: " + err.message);
    }
  };

  // mở modal update
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      tenSP: product.tenSP,
      code: product.code,
      mauSP: product.mauSP,
      moTa: product.moTa,
      soLuong: product.soLuong,
      giaTien: product.giaTien,
      ma_CTDM: product.ma_CTDM,
      anhSP: product.anhSP,
    });
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const updatedProducts = await Promise.all(
          data.map(async (product) => {
            const category = await getCtCategoryById(product.ma_CTDM);
            return { ...product, tenCTDM: category.tenCTDM };
          })
        );
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCtCategory();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);
  const getCategoryName = (ma_CTDM) => {
    const category = categories.find((cat) => cat.ma_CTDM === ma_CTDM);
    return category ? category.tenCTDM : "Không xác định";
  };

  const handleInputChange = (e) => {
    const { id, value, type } = e.target;
    // Coerce numeric inputs to numbers
    const nextValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prevData) => ({ ...prevData, [id]: nextValue }));
  };

  const handleSubmit = async () => {
    if (!validateForm(formData)) {
      alert(
        "Vui lòng điền đầy đủ thông tin sản phẩm và giá tiền phải lớn hơn 0."
      );
      return;
    }

    try {
      const data = await createProduct(formData);
      setProducts((prevProducts) => [data, ...prevProducts]);
      setModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct) return;
    if (!validateForm(formData)) {
      alert(
        "Vui lòng điền đầy đủ thông tin sản phẩm và giá tiền phải lớn hơn 0."
      );
      return;
    }

    try {
      const updatedData = { ...formData, maSP: selectedProduct.maSP };

      await updateProduct(updatedData);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.maSP === selectedProduct.maSP
            ? { ...product, ...formData }
            : product
        )
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.maSP !== id)
      );
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchProducts(query);
      console.log("tìm kiếm :", data);
      setProducts(data);
    } catch (error) {
      console.log("Lỗi tìm kiếm sản phẩm: ", error);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        handleSearch(searchQuery);
      } else {
        getAllProducts().then(setProducts);
      }
    }, 300);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(products.length / recordsPerPage);

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3001${imageArray[0]}`;
    }
    return "/image/default.jpg";
  };

  return (
    <div className="container-fluid mt-1">
      <h3 className="mb-5 mt-2 text-center title-text-main ">
        Danh sách sản phẩm
      </h3>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          className="btn-add"
          onClick={() => {
            setSelectedProduct(null);
            resetFormData();
            setModalOpen(true);
          }}
        >
          <i className="bi bi-file-earmark-plus"></i> Thêm sản phẩm
        </button>

        <div className="quanly-center">
          <form className="search-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="search"
              className="search-input"
              placeholder="Tìm kiếm thông tin ...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">
              <i className="bi bi-search"></i>
            </span>
          </form>
        </div>
      </div>

      <table className="table tb-sanPham table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>Mã hàng</th>
            <th>Loại hàng</th>
            <th>Tên hàng</th>
            <th>Màu</th>
            <th>Ảnh</th>
            <th>Mô tả</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th colSpan={2}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((product) => (
            <tr key={product.maSP}>
              <td>{product.code}</td>
              <td>{getCategoryName(product.ma_CTDM)}</td>
              <td>{product.tenSP}</td>
              <td>{product.mauSP}</td>
              <td>
                <img
                  src={getProductImage(product.anhSP)}
                  alt={product.tenSP}
                  className="product-img"
                />
              </td>
              <td>{product.moTa}</td>
              <td>{product.soLuong}</td>
              <td>{product.giaTien?.toLocaleString()}đ</td>
              <td className="text-center">
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditClick(product)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
              <td className="text-center">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(product.maSP)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* phân trang */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        {/* Select số bản ghi */}
        <div className="d-flex align-items-center">
          <label className="me-2 fw-semibold">Hiển thị:</label>
          <select
            className="form-select w-auto"
            value={recordsPerPage}
            onChange={(e) => {
              setRecordsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Phân trang */}
        <nav>
          <ul className="pagination-container">
            {currentPage > 1 && (
              <li>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  &laquo;
                </button>
              </li>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(currentPage - 2, 0),
                Math.min(currentPage + 1, totalPages)
              )
              .map((page) => (
                <li key={page}>
                  <button
                    className={`pagination-btn ${
                      currentPage === page ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

            {currentPage < totalPages && (
              <li>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  &raquo;
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="sanpham-admin-modal">
          <div className="modal-overlay">
            <div className="modal-content">
              <span
                className="close-btn"
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                <i className="bi bi-x-circle"></i>
              </span>
              <h4 className="my-3 text-center">
                {selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
              </h4>
              <div className="modal-body">
                {/* Bên trái: ảnh */}
                <div className="left-image-preview">
                  <label className="form-label">Ảnh sản phẩm</label>
                  <div className="selected-images mb-1">
                    {previewUrls.length > 0 ? (
                      previewUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Ảnh ${idx + 1}`}
                          className="img-fluid rounded border"
                          style={{
                            maxHeight: 100,
                            objectFit: "contain",
                            marginRight: 8,
                          }}
                        />
                      ))
                    ) : Array.isArray(formData.anhSP) &&
                      formData.anhSP.length > 0 ? (
                      formData.anhSP.map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:3001${img}`}
                          alt={`Ảnh ${idx + 1}`}
                          className="img-fluid rounded border"
                          style={{
                            maxHeight: 100,
                            objectFit: "contain",
                            marginRight: 8,
                          }}
                        />
                      ))
                    ) : (
                      <img
                        src="/image/default.jpg"
                        alt="Ảnh sản phẩm"
                        className="img-fluid rounded border"
                        style={{ maxHeight: 100, objectFit: "contain" }}
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    multiple
                    onChange={handleFilesSelect}
                  />
                </div>

                {/* Bên phải: thông tin */}
                <div className="right-form">
                  <div className="form-group">
                    <input
                      type="text"
                      id="tenSP"
                      placeholder="Tên sản phẩm"
                      value={formData.tenSP}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <select
                      id="ma_CTDM"
                      value={formData.ma_CTDM}
                      onChange={handleInputChange}
                    >
                      <option value={0}>Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.ma_CTDM} value={cat.ma_CTDM}>
                          {cat.tenCTDM}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      id="code"
                      placeholder="Code sản phẩm"
                      value={formData.code}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      id="mauSP"
                      placeholder="Màu sắc"
                      value={formData.mauSP}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      id="moTa"
                      placeholder="Mô tả"
                      value={formData.moTa}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      id="soLuong"
                      placeholder="Số lượng"
                      value={formData.soLuong}
                      min={0}
                      step={1}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      id="giaTien"
                      placeholder="Giá thành"
                      value={formData.giaTien}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mt-3 d-flex justify-content-end">
                    <button
                      className="btn-save"
                      onClick={selectedProduct ? handleUpdate : handleSubmit}
                    >
                      <i className="bi bi-save" />{" "}
                      {selectedProduct ? "Cập nhật" : "Thêm"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SanPhamAdmin;
