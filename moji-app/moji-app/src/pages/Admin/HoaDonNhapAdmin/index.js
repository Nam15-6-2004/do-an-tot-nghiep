import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useEffect, useRef, useState } from "react";
import { getAllUsers, getUserById } from "../../../services/nguoiDungService";
import {
  getAllProducts,
  getProductById,
} from "../../../services/sanPhamService";
import {
  deleteImprot,
  getAllImport,
  getImportById,
  insertImport,
  searchImprot,
} from "../../../services/hoaDonNhapService";
import {
  getAllSuppliers,
  getSupplierById,
} from "../../../services/nhaCungCapAdmin";

function HoaDonNhapAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [imports, setImports] = useState([]);
  const [users, setUsers] = useState({});
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [selectedImport, setSelectedImport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  const [newCTHoaDons, setNewCTHoaDons] = useState([
    {
      maSP: "",
      soLuong: 0,
      donGia: 0,
    },
  ]);

  const addCTHoaDon = () => {
    // Cập nhật chi tiết hóa đơn
    setNewCTHoaDons([...newCTHoaDons, { maSP: "", soLuong: 0, donGia: 0 }]);
  };

  const removeCTHoaDon = (index) => {
    // Xóa chi tiết hóa đơn
    const newCTHoaDonsUpdated = [...newCTHoaDons];
    newCTHoaDonsUpdated.splice(index, 1);
    setNewCTHoaDons(newCTHoaDonsUpdated);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  //

  const [nhaCungCaps, setNhaCungCaps] = useState([]);
  const [sanPhams, setSanPhams] = useState([]);
  const [nguoiDung, setNguoiDung] = useState(null);

  const [formData, setFormData] = useState({
    maNCC: "",
    maSP: "",
    phuongThuc: "",
    soLuong: 0,
    donGia: 0,
    giamGia: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const nccs = await getAllSuppliers();
      const sps = await getAllProducts();
      setNhaCungCaps(nccs);
      setSanPhams(sps);
    };
    fetchData();
  }, []);

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
  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      phuongThuc: "",
      maNCC: "",
      giamGia: 0,
      maSP: "",
      soLuong: 0,
      donGia: 0,
    });
    setNewCTHoaDons([{ maSP: "", soLuong: 0, donGia: 0 }]);
  };

  const handleAddImport = async () => {
    if (!formData.maNCC || !formData.phuongThuc) {
      alert("Vui lòng chọn nhà cung cấp và phương thức thanh toán.");
      return;
    }

    if (
      newCTHoaDons.length === 0 ||
      newCTHoaDons.some((ct) => !ct.maSP || ct.soLuong <= 0 || ct.donGia <= 0)
    ) {
      alert("Vui lòng điền đầy đủ chi tiết hóa đơn (số lượng và đơn giá > 0).");
      return;
    }

    for (let ct of newCTHoaDons) {
      const product = await getProductById(ct.maSP);

      if (ct.donGia > product.giaTien) {
        alert(
          `Đơn giá của sản phẩm ${ct.maSP} - ${
            product.tenSP
          } phải nhỏ hơn (${product.giaTien.toLocaleString()}đ).`
        );
        return;
      }
    }

    try {
      const payload = {
        maNCC: formData.maNCC,
        maND: nguoiDung.maND,
        phuongThuc: formData.phuongThuc,
        giamGia: formData.giamGia,
        CTHoaDonNhaps: [
          ...newCTHoaDons.map((ct) => ({
            maSP: ct.maSP,
            soLuong: ct.soLuong,
            donGia: ct.donGia,
          })),
        ],
      };
      console.log("payload hóa đơn nhập", payload);
      const result = await insertImport(payload);

      if (result) {
        setImports((prev) => [...prev, result]);
        // Reset form
        setFormData({
          phuongThuc: "",
          maNCC: "",
          giamGia: 0,
          maSP: "",
          soLuong: 0,
          donGia: 0,
        });
        setNewCTHoaDons([{ maSP: "", soLuong: 0, donGia: 0 }]);

        setModalOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi thêm hóa đơn nhập:", error);
    }
  };

  //
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getAllImport();
        setImports(data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      }
    };
    fetchBills();
  }, []);
  // Lấy thông tin người dùng theo maND
  useEffect(() => {
    const fetchUserDetails = async (maND) => {
      try {
        const user = await getUserById(maND);
        setUsers((prevUsers) => ({
          ...prevUsers,
          [maND]: user,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    //
    imports.forEach((imp) => {
      if (imp.maND) {
        fetchUserDetails(imp.maND);
      }
    });
  }, [imports]);

  // Lấy thông tin sản phẩm theo maSP
  useEffect(() => {
    const fetchProductDetails = async (maSP) => {
      try {
        const product = await getProductById(maSP);
        setProducts((prevProducts) => ({
          ...prevProducts,
          [maSP]: product,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    //
    imports.forEach((imp) => {
      imp.CTHoaDonNhaps.forEach((item) => {
        if (item.maSP) {
          fetchProductDetails(item.maSP);
        }
      });
    });
  }, [imports]);

  // Lấy thông tin phân phối theo maNCC
  useEffect(() => {
    const fetchSupplierDetails = async (maNCC) => {
      try {
        const supplier = await getSupplierById(maNCC);

        setSupplier((prevSupplier) => ({
          ...prevSupplier,
          [maNCC]: supplier,
        }));
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    //
    imports.forEach((imp) => {
      if (imp.maNCC) {
        fetchSupplierDetails(imp.maNCC);
      }
    });
  }, [imports]);

  const handleViewDetails = async (maHDN) => {
    try {
      const importDetail = await getImportById(maHDN);
      setSelectedImport(importDetail);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi tiết hóa đơn:", error);
    }
  };

  const handleDeleteImport = async (id) => {
    try {
      const data = await deleteImprot(id);

      if (data.CTHoaDonNhaps) {
        // xóa hóa đơn
        setImports((prev) => prev.filter((imp) => imp.maHDN !== id));
        setSelectedImport(null);
      } else {
        //  xóa chi tiết hóa đơn
        const updated = await getImportById(selectedImport.maHDN);

        setImports((prev) =>
          prev.map((imp) => (imp.maHDN === updated.maHDN ? updated : imp))
        );

        setSelectedImport(updated);
      }
      if (window.location.pathname === "/don-nhap-admin") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchImprot(query);
      setImports(data);
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
        getAllImport().then(setImports);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = imports.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(imports.length / recordsPerPage);

  return (
    <div className="container-fluid mt-1">
      <h3 className="mb-5 mt-2 text-center title-text-main ">
        Danh sách đơn hàng nhập
      </h3>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <button className="btn-add" onClick={() => setModalOpen(true)}>
          <i className="bi bi-file-earmark-plus"></i> Thêm hóa đơn
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
      {/* new Date(....).toLocaleDateString(vi-VN) */}
      <table className="table table-bordered text-center align-middle">
        <thead>
          <tr>
            <th>Nhân viên</th>
            <th>Ngày nhập</th>
            <th>Phân phối</th>
            {/* <th>Giảm giá</th> */}
            <th>Điện thoại PP</th>
            <th>Địa chỉ PP</th>
            <th>Tổng tiền</th>
            <th colSpan={2}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((imp) => (
            <tr key={imp.maHDN}>
              <td>{users[imp.maND]?.tenND}</td>
              <td>{new Date(imp.ngayNhap).toLocaleDateString()}</td>
              <td>{supplier[imp.maNCC]?.tenNCC}</td>
              {/* <td>{imp.giamGia}đ</td> */}
              <td>{supplier[imp.maNCC]?.sdt}</td>
              <td>{supplier[imp.maNCC]?.diaChi}</td>
              <td>{imp.tongTien.toLocaleString("vi-VN")}đ</td>
              <td>
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDeleteImport(imp.maHDN)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
              <td>
                <button
                  className="btn btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#billDetailModal"
                  onClick={() => handleViewDetails(imp.maHDN)}
                >
                  <i className="bi bi-file-earmark-text"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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

      <div className="modal" id="billDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết hóa đơn</h5>
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
                    <th>Mã hàng</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Ảnh</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedImport &&
                    selectedImport.CTHoaDonNhaps.map((detail, index) => (
                      <tr key={index}>
                        <td>{products[detail.maSP]?.code}</td>
                        <td>{products[detail.maSP]?.tenSP}</td>
                        <td>{detail.soLuong}</td>
                        <td>
                          <img
                            src={`http://localhost:3001${detail.SanPham.anhSP[0]}`}
                            alt="Sản phẩm"
                            width="60"
                            height="70"
                          />
                        </td>
                        <td>{detail.donGia.toLocaleString("vi-VN")}đ</td>
                        <td>{detail.thanhTien.toLocaleString("vi-VN")}đ</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteImport(detail.ma_CTHDN)}
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
      {/* form modal */}

      {modalOpen && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm hóa đơn nhập</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nhân viên</label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    value={nguoiDung ? nguoiDung.tenND : ""}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phương thức</label>
                  <select
                    className="form-select mb-3"
                    value={formData.phuongThuc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phuongThuc: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Chọn phương thức --</option>
                    <option value="Thanh toán khi nhận hàng">
                      Thanh toán khi nhận hàng
                    </option>
                    <option value="Chuyển khoản trực tiếp">
                      Chuyển khoản trực tiếp
                    </option>
                  </select>
                </div>

                <div className="mb-3 me-2">
                  <label className="form-label">Phân phối</label>

                  <select
                    className="form-select"
                    value={formData.maNCC}
                    onChange={(e) =>
                      setFormData({ ...formData, maNCC: e.target.value })
                    }
                  >
                    <option value="">-- Chọn nhà cung cấp --</option>
                    {nhaCungCaps.map((ncc) => (
                      <option key={ncc.maNCC} value={ncc.maNCC}>
                        {ncc.tenNCC}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Giảm giá</label>
                  <select
                    className="form-select"
                    value={formData.giamGia}
                    onChange={(e) =>
                      setFormData({ ...formData, giamGia: e.target.value })
                    }
                  >
                    <option value={0}>0</option>
                    <option value={5}>moji5k</option>
                    <option value={10}>moji10k</option>
                    <option value={15}>moji15k</option>
                    <option value={20}>moji20k</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Chi tiết hóa đơn:</label>
                  {newCTHoaDons.map((ct, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <div className="w-100 mb-3 me-2">
                        <label className="form-label">Sản phẩm</label>
                        <select
                          className="form-select mb-3"
                          value={ct.maSP}
                          onChange={(e) => {
                            const updated = [...newCTHoaDons];
                            updated[index].maSP = e.target.value;
                            setNewCTHoaDons(updated);
                          }}
                        >
                          <option value="">-- Chọn sản phẩm --</option>
                          {sanPhams.map((sp) => (
                            <option key={sp.maSP} value={sp.maSP}>
                              {sp.tenSP}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="d-flex w-100 mb-3">
                        <div className="mb-3 me-2 flex-grow-1">
                          <label className="form-label">Số lượng</label>
                          <input
                            type="number"
                            className="form-control"
                            min={0}
                            value={ct.soLuong}
                            onChange={(e) => {
                              const updated = [...newCTHoaDons];
                              updated[index].soLuong = e.target.value;
                              setNewCTHoaDons(updated);
                            }}
                          />
                        </div>

                        <div className="mb-3 me-2 flex-grow-1">
                          <label className="form-label">Đơn giá</label>
                          <input
                            type="number"
                            className="form-control"
                            min={0}
                            value={ct.donGia}
                            onChange={(e) => {
                              const updated = [...newCTHoaDons];
                              updated[index].donGia = e.target.value;
                              setNewCTHoaDons(updated);
                            }}
                          />
                        </div>

                        <button
                          className="btn btn-danger ms-1 mt-3 align-self-center"
                          onClick={() => removeCTHoaDon(index)}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                  <button className="btn btn-secondary" onClick={addCTHoaDon}>
                    <i className="bi bi-plus"></i> Thêm chi tiết
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddImport}
                >
                  Thêm hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HoaDonNhapAdmin;
