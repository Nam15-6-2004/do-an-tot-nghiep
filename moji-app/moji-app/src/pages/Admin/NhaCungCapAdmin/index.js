import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./NhaCungCapAdmin.scss";
import { useEffect, useRef, useState } from "react";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  searchSuppliers,
  updateSupplier,
} from "../../../services/nhaCungCapAdmin";
function NhaCungCapAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  const [formData, setFormData] = useState({
    tenNCC: "",
    diaChi: "",
    sdt: "",
    email: "",
  });

  const validateFormRong = (formData) => {
    if (
      !formData.tenNCC ||
      !formData.diaChi ||
      !formData.sdt ||
      !formData.email
    ) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const resetFormData = () => {
    setFormData({
      tenNCC: "",
      diaChi: "",
      sdt: "",
      email: "",
    });
  };
  // sửa 1
  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setFormData({
      tenNCC: supplier.tenNCC || "",
      diaChi: supplier.diaChi || "",
      sdt: supplier.sdt || "",
      email: supplier.email || "",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };
  // Hàm kiểm tra email
  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  }

  // Hàm kiểm tra số điện thoại
  function isValidPhone(sdt) {
    return /^0\d{9}$/.test(sdt);
  }

  const handleSubmit = async () => {
    if (!validateFormRong(formData)) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Email không hợp lệ. Email có định dạng 'abc@gmail.com'.");
      return;
    }

    if (!isValidPhone(formData.sdt)) {
      alert("Số điện thoại không hợp lệ. Phải bắt đầu từ số 0 và có 10 số.");
      return;
    }
    try {
      const data = await createSupplier(formData);
      setSuppliers((prev) => [...prev, data]);
      setModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi thêm nhà cung cấp:", error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedSupplier) return;
    if (!validateFormRong(formData)) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    if (!isValidEmail(formData.email)) {
      alert("Email không hợp lệ. Email có định dạng 'abc@gmail.com'.");
      return;
    }

    if (!isValidPhone(formData.sdt)) {
      alert("Số điện thoại không hợp lệ. Phải bắt đầu từ số 0 và có 10 số.");
      return;
    }
    try {
      await updateSupplier({ ...formData, maNCC: selectedSupplier.maNCC });
      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.maNCC === selectedSupplier.maNCC ? { ...sup, ...formData } : sup
        )
      );
      setModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật nhà cung cấp:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      setSuppliers((prev) => prev.filter((sup) => sup.maNCC !== id));
    } catch (error) {
      console.error("Lỗi khi xóa nhà cung cấp:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchSuppliers(query);
      setSuppliers(data);
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
        getAllSuppliers().then(setSuppliers);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = suppliers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(suppliers.length / recordsPerPage);

  return (
    <div className="container-fluid mt-1">
      <h3 className="mb-5 mt-2 text-center title-text-main ">
        Danh sách nhà cung cấp
      </h3>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button
          className="btn-add"
          onClick={() => {
            setSelectedSupplier(null);
            resetFormData();
            setModalOpen(true);
          }}
        >
          <i className="bi bi-file-earmark-plus"></i> Thêm nhà cung cấp
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
            <th>Mã nhà phân phối</th>
            <th>Nhà phân phối</th>
            <th>Địa chỉ</th>
            <th>Điện thoại</th>
            <th>Email</th>
            <th colSpan={2}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((supplier) => (
            <tr key={supplier.maNCC}>
              <td>{supplier.maNCC}</td>
              <td>{supplier.tenNCC}</td>
              <td>{supplier.diaChi}</td>
              <td>{supplier.sdt}</td>
              <td>{supplier.email}</td>
              <td>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditClick(supplier)}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(supplier.maNCC)}
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

      {modalOpen && (
        <div className="nhacungcap-admin-modal">
          <div className="modal-overlay">
            <div className="modal-content">
              <span className="close-btn" onClick={() => setModalOpen(false)}>
                <i className="bi bi-x-circle"></i>
              </span>
              <h3 className="mt-5 mb-4">
                {selectedSupplier ? "Cập nhật thông tin" : "Thêm mới thông tin"}
              </h3>
              <div className="form-group">
                <input
                  type="text"
                  id="tenNCC"
                  className="form-control"
                  placeholder="Tên nhà cung cấp"
                  value={formData.tenNCC}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="diaChi"
                  className="form-control"
                  placeholder="Địa chỉ"
                  value={formData.diaChi}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="sdt"
                  className="form-control"
                  placeholder="Số điện thoại"
                  value={formData.sdt}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <button
                className="btn-save"
                onClick={selectedSupplier ? handleUpdate : handleSubmit}
              >
                <i className="bi bi-save"></i>{" "}
                {selectedSupplier ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NhaCungCapAdmin;
