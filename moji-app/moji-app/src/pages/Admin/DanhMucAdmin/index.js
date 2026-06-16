// ...Các import như cũ
import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./DanhMuc.scss";

import {
  deleteCategory,
  getAllCategory,
  getCategoryById,
  insertCategory,
  searchCategory,
  updateCategory,
} from "./../../../services/danhMucService";

function DanhMucAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectedCate, setSelectedCate] = useState(null);
  const [newCateName, setNewcateName] = useState("");
  const [newCTDanhMucs, setNewCTDanhMucs] = useState([{ tenCTDM: "" }]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    const fetchCates = async () => {
      try {
        const data = await getAllCategory();
        setCategory(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
      }
    };
    fetchCates();
  }, []);

  const addCTDanhMuc = () => {
    setNewCTDanhMucs([...newCTDanhMucs, { tenCTDM: "" }]);
  };

  const removeCTDanhMuc = (index) => {
    const updated = [...newCTDanhMucs];
    updated.splice(index, 1);
    setNewCTDanhMucs(updated);
  };

  const handleCTDanhMucChange = (index, value) => {
    const updated = [...newCTDanhMucs];
    updated[index].tenCTDM = value;
    setNewCTDanhMucs(updated);
  };

  const handleSaveCategory = async () => {
    if (newCateName.trim() === "") {
      alert("Tên danh mục không được để trống.");
      return;
    }

    // const filteredCTDanhMucs = newCTDanhMucs.filter(
    //   (ct) => ct.tenCTDM.trim() !== ""
    // );
    // if (filteredCTDanhMucs.length === 0) {
    //   alert("Vui lòng thêm ít nhất một chi tiết danh mục.");
    //   return;
    // }

    const body = {
      tenDM: newCateName,
      CTDanhMucs: newCTDanhMucs.filter((ct) => ct.tenCTDM.trim() !== ""),
    };

    try {
      if (isEditing && selectedCate) {
        const updated = await updateCategory({
          maDM: selectedCate.maDM,
          ...body,
        });
        setCategory((prev) =>
          prev.map((item) => (item.maDM === updated.maDM ? updated : item))
        );
      } else {
        const newData = await insertCategory(body);
        setCategory((prev) => [...prev, newData]);
      }
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setIsEditing(false);
    setNewcateName("");
    setNewCTDanhMucs([{ tenCTDM: "" }]);
    setSelectedCate(null);
  };

  const handleDeleteCate = async (id) => {
    try {
      const data = await deleteCategory(id);
      if (data.CTDanhMucs) {
        setCategory((prev) => prev.filter((cate) => cate.maDM !== id));
      } else {
        const updated = await getCategoryById(selectedCate.maDM);
        setCategory((prev) =>
          prev.map((cate) => (cate.maDM === updated.maDM ? updated : cate))
        );
        setSelectedCate(updated);
      }
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const handleUpdateCate = async (cateOrDetail) => {
    const isDetail = typeof cateOrDetail === "string";
    const id = isDetail ? cateOrDetail : cateOrDetail.maDM;
    try {
      const data = await getCategoryById(id);
      setNewcateName(data.tenDM);
      setNewCTDanhMucs(data.CTDanhMucs);
      setSelectedCate(data);
      setIsEditing(true);
      setModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
    }
  };

  const handleViewDetails = async (maDM) => {
    try {
      const cateDetail = await getCategoryById(maDM);
      setSelectedCate(cateDetail);
    } catch (error) {
      console.error("Lỗi khi xem chi tiết:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchCategory(query);
      setCategory(data);
    } catch (error) {
      console.log("lỗi tìm kiếm nhà cung cấp: ", error);
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
        getAllCategory().then(setCategory);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = category.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(category.length / recordsPerPage);

  return (
    <div className="container-fluid mt-1">
      <h3 className="mb-5 mt-2 text-center title-text-main">
        Danh sách loại hàng
      </h3>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button className="btn-add" onClick={() => setModalOpen(true)}>
          <i className="bi bi-file-earmark-plus"></i> Thêm danh mục
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

      <table className="table table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>Mã danh mục</th>
            <th>Tên danh mục</th>
            <th colSpan={3}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((cate) => (
            <tr key={cate.maDM}>
              <td>{cate.maDM}</td>
              <td>{cate.tenDM}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleUpdateCate(cate)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDeleteCate(cate.maDM)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#cateDetailModal"
                  onClick={() => handleViewDetails(cate.maDM)}
                >
                  <i className="bi bi-file-earmark-text"></i>
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

      <div className="modal" id="cateDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết danh mục</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered text-center align-middle">
                <thead>
                  <tr>
                    <th>Mã chi tiết</th>
                    <th>Danh mục chi tiết</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCate?.CTDanhMucs?.map((detail, index) => (
                    <tr key={index}>
                      <td>{detail.ma_CTDM}</td>
                      <td>{detail.tenCTDM}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteCate(detail.ma_CTDM)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="danhmuc-admin-modal">
          <div className="modal-overlay">
            <div className="modal-content">
              <span className="close-btn" onClick={closeModal}>
                <i className="bi bi-x-circle"></i>
              </span>
              <h3 className="mt-5 mb-4">
                {isEditing ? "Cập nhật thông tin" : "Thêm thông tin mới"}
              </h3>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên danh mục"
                  value={newCateName}
                  onChange={(e) => setNewcateName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Chi tiết danh mục:</label>
                {newCTDanhMucs.map((ct, index) => (
                  <div key={index} className="mb-2 d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control"
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                      placeholder={`Chi tiết ${index + 1}`}
                      value={ct.tenCTDM}
                      onChange={(e) =>
                        handleCTDanhMucChange(index, e.target.value)
                      }
                    />
                    <button
                      className="btn btn-danger"
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        height: "41px",
                      }}
                      onClick={() => removeCTDanhMuc(index)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ))}
                {!isEditing && (
                  <button className="btn btn-secondary" onClick={addCTDanhMuc}>
                    <i className="bi bi-plus"></i> Thêm chi tiết
                  </button>
                )}
              </div>
              <button className="btn-save" onClick={handleSaveCategory}>
                <i className="bi bi-save"></i> {isEditing ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DanhMucAdmin;
