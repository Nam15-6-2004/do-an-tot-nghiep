import { useEffect, useRef, useState } from "react";
import {
  deleteUser,
  getAllUsers,
  searchUser,
  updateUser,
} from "../../../services/nguoiDungService";
import "./TaiKhoanAdmin.scss";

function TaiKhoanAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const [vaiTroFilter, setVaiTroFilter] = useState("U11");
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const fecthUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.log("Lỗi khi lấy danh sách tài khoản:", error);
      }
    };

    fecthUsers();
  }, []);
  const handleVaiTro = async (maND, newVaiTro) => {
    try {
      const updateRoleUser = await updateUser({ maND, maVT: newVaiTro });
      setUsers((prev) =>
        prev.map((u) => (u.maND === maND ? updateRoleUser : u))
      );
      setSelectedUser(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.maND !== id));
      //selectedUser(null);
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  const handleSearch = async (query) => {
    try {
      const data = await searchUser(query);
      setUsers(data);
    } catch (error) {
      console.log("lỗi tìm kiếm người dùng: ", error);
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
        getAllUsers().then(setUsers);
      }
    }, 300);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  const filteredUsers = users.filter((user) => user.maVT === vaiTroFilter);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredUsers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

  return (
    <>
      <div className="container-fluid">
        <h3 className="mb-5 mt-2 text-center title-text-main ">
          Danh sách tài khoản
        </h3>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="select-wrapper position-relative">
            <select
              className="btn-select text-start"
              id="status"
              value={vaiTroFilter}
              onChange={(e) => {
                setVaiTroFilter(e.target.value);
                setSelectedUser(null);
                setCurrentPage(1);
              }}
            >
              <option value="U11">Khách hàng</option>
              <option value="A00">Nhân viên</option>
            </select>
          </div>

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
        <div className="row">
          <div className="col-md-9">
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tài khoản</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Ngày đăng ký</th>
                  <th>Chọn</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((tk, index) => (
                  <tr key={tk.maND}>
                    <td>{index + 1}</td>
                    <td>{tk.taiKhoan}</td>
                    <td>{tk.tenND}</td>
                    <td>{tk.email}</td>
                    <td>{new Date(tk.createdAt).toLocaleDateString()}</td>
                    <td className="align-middle text-center">
                      <input
                        type="radio"
                        name="selectedUser"
                        onChange={() => setSelectedUser(tk)}
                        checked={selectedUser?.maND === tk.maND}
                        style={{
                          transform: "scale(1.5)",
                          cursor: "pointer",
                        }}
                      />
                    </td>

                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(tk.maND)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          </div>

          <div className="col-md-3">
            <div
              className="form-container"
              style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <div className="mb-3 text-center">
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    alt={selectedUser ? selectedUser.tenND : ""}
                    className="rounded-circle me-2"
                    height={150}
                    src={
                      selectedUser
                        ? `http://localhost:3001${selectedUser.anhThe}`
                        : "/image/default.jpg"
                    }
                    width={150}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="username">
                  Tài khoản
                </label>
                <input
                  className="form-control"
                  id="username"
                  type="text"
                  value={selectedUser ? selectedUser.taiKhoan : "usename(*)"}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="status">
                  Vai trò
                </label>
                <select
                  className="form-select"
                  id="status"
                  value={selectedUser ? selectedUser.maVT : ""}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      maVT: e.target.value,
                    })
                  }
                >
                  <option value="">Lựa chọn (*)</option>
                  <option value="U11">Khách hàng</option>
                  <option value="A00">Nhân viên</option>
                </select>
              </div>

              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handleVaiTro(selectedUser.maND, selectedUser.maVT)
                  }
                >
                  <i className="bi bi-save"></i> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaiKhoanAdmin;
