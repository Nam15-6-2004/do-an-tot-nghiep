import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/nguoiDungService";
import {
  getHistoryBillByUser,
  huyDonHang,
} from "../../services/hoaDonBanService";
import { Link } from "react-router-dom";

function DonHang() {
  const [activeTab, setActiveTab] = useState("daDuyet");
  const [userData, setUserData] = useState(null);
  const [hoaDonDaDuyet, setHoaDonDaDuyet] = useState([]);
  const [hoaDonChoDuyet, setHoaDonChoDuyet] = useState([]);
  const [hoaDonDaHuy, setHoaDonDaHuy] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const maND = decoded.maND;
        if (!maND) throw new Error("Không tìm thấy maND trong token!");
        const user = await getUserById(maND);
        setUserData(user);
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin người dùng:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserData();
  }, [token]);
  useEffect(() => {
    const maND = userData?.maND || userData?.id;
    if (maND) {
      getHistoryBillByUser(maND).then((data) => {
        setHoaDonDaDuyet(data.daDuyet || []);
        setHoaDonChoDuyet(data.choDuyet || []);
        setHoaDonDaHuy(data.daHuy || []);
      });
    }
  }, [userData]);

  const handleHuyHoaDon = async (maHDB) => {
    try {
      await huyDonHang({ maHDB });
      const huyDon = hoaDonChoDuyet.find((hd) => hd.maHDB === maHDB);

      if (huyDon) {
        huyDon.trangThai = "Đã huỷ";
        setHoaDonChoDuyet(hoaDonChoDuyet.filter((hd) => hd.maHDB !== maHDB));
        setHoaDonDaHuy([...hoaDonDaHuy, huyDon]);
      }
    } catch (error) {
      console.error("Lỗi khi huỷ đơn hàng:", error);
    }
  };

  const getProductImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return `http://localhost:3001${imageArray[0]}`;
    }
    return "/image/default.jpg";
  };

  // Helper: badge và màu theo trạng thái
  const getBadge = (trangThai) => {
    if (!trangThai) return <span className="badge bg-secondary">Không rõ</span>;
    if (
      trangThai.toLowerCase().includes("hủy") ||
      trangThai.toLowerCase().includes("huỷ")
    )
      return <span className="badge bg-danger">Đã huỷ</span>;
    if (trangThai.toLowerCase().includes("chờ"))
      return <span className="badge bg-warning text-dark">Chờ duyệt</span>;
    return <span className="badge bg-success">Đã duyệt</span>;
  };

  const renderOrderRow = (hd, userData) => (
    <div className="row">
      <div className="col-md-6">
        <div className="mb-2">{getBadge(hd.trangThai)}</div>
        <p className="mb-1">
          <strong>Ngày đặt:</strong> {new Date(hd.ngayBan).toLocaleDateString()}
        </p>
        <p className="mb-1">
          <strong>Phương thức thanh toán:</strong> {hd.phuongThuc}
        </p>
        <p className="mb-1">
          <strong>Địa chỉ nhận hàng:</strong> {hd.diaChi || userData?.diaChi}
        </p>
        <p className="mb-1">
          <strong>Tổng tiền:</strong>{" "}
          <span style={{ color: "#e53935", fontWeight: 600 }}>
            {hd.tongTien?.toLocaleString()} đ
          </span>
        </p>
      </div>
      <div className="col-md-6">
        <ul className="list-unstyled">
          {hd.CTHoaDonBans?.map((ct) => (
            <li
              key={ct.ma_CTHDB}
              className="d-flex align-items-center gap-3 mb-2 border-bottom pb-2"
            >
              {ct.SanPham?.anhSP && ct.SanPham.anhSP.length > 0 && (
                <img
                  src={getProductImage(ct.SanPham.anhSP)}
                  alt={ct.SanPham.tenSP}
                  className="img-thumbnail"
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #e0e7ef",
                  }}
                />
              )}
              <div style={{ minWidth: 0 }}>
                <div
                  className="fw-bold"
                  title={ct.SanPham?.tenSP}
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Link
                    to={`/san-pham/${ct.maSP}`}
                    className="text-decoration-none text-dark"
                    style={{ color: "#7c6a56", fontWeight: 600 }}
                  >
                    {ct.SanPham?.tenSP || "Sản phẩm"}
                  </Link>
                </div>

                <div className="text-muted" style={{ fontSize: 13 }}>
                  Số lượng: {ct.soLuong}
                </div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  Đơn giá: {ct.donGia?.toLocaleString()} đ
                </div>
                <div className="text-danger" style={{ fontSize: 13 }}>
                  Thành tiền: {ct.thanhTien?.toLocaleString()} đ
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="row g-4 align-items-start">
        {/* Thông tin đặt hàng */}

        <div className="card shadow p-4">
          <div className="d-flex align-items-center mb-4">
            <i
              className="bi bi-bag-check"
              style={{ fontSize: 28, color: "#7c6a56", marginRight: 12 }}
            ></i>
            <h4 className="mb-0 fw-bold" style={{ color: "#1a202c" }}>
              Lịch sử đơn hàng
            </h4>
          </div>
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link${
                  activeTab === "daDuyet" ? " active" : ""
                }`}
                onClick={() => setActiveTab("daDuyet")}
              >
                Đã duyệt
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link${
                  activeTab === "choDuyet" ? " active" : ""
                }`}
                onClick={() => setActiveTab("choDuyet")}
              >
                Chờ duyệt
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link${activeTab === "daHuy" ? " active" : ""}`}
                onClick={() => setActiveTab("daHuy")}
              >
                Đã huỷ
              </button>
            </li>
          </ul>
          <div>
            {activeTab === "daDuyet" &&
              (hoaDonDaDuyet.length > 0 ? (
                hoaDonDaDuyet.map((hd) => (
                  <div
                    key={hd.maHDB}
                    className="border rounded p-3 shadow-sm bg-white position-relative"
                    style={{ borderLeft: "5px solid #28a745" }}
                  >
                    {renderOrderRow(hd, userData)}
                    <Link to={`/hoan-thanh`} className="text-decoration-none">
                      <div
                        className="d-flex justify-content-end align-items-center mt-2"
                        style={{ fontSize: 13, color: "#1AC130" }}
                      >
                        <i className="bi bi-clock-history me-1"></i>
                        Đã giao thành công
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p>Không có hóa đơn đã duyệt.</p>
              ))}
            {activeTab === "choDuyet" &&
              (hoaDonChoDuyet.length > 0 ? (
                hoaDonChoDuyet.map((hd) => (
                  <div
                    key={hd.maHDB}
                    className="border rounded p-3 mb-3 shadow-sm bg-white position-relative"
                    style={{ borderLeft: "5px solid #0d6efd" }}
                  >
                    {renderOrderRow(hd, userData)}
                    <div
                      className="d-flex justify-content-end align-items-center mt-2"
                      style={{ fontSize: 13, color: "#0d6efd" }}
                    >
                      <i className="bi bi-clock-history me-1"></i>
                      Đang chờ xử lý/giao hàng
                    </div>
                    <div className="text-end mt-2">
                      <button
                        className="btn btn-danger btn-sm px-3"
                        onClick={() => handleHuyHoaDon(hd.maHDB)}
                      >
                        Huỷ đơn hàng
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có hóa đơn chờ duyệt hoặc đang xử lý.</p>
              ))}
            {activeTab === "daHuy" &&
              (hoaDonDaHuy.length > 0 ? (
                hoaDonDaHuy.map((hd) => (
                  <div
                    key={hd.maHDB}
                    className="border rounded p-3 mb-3 shadow-sm bg-white position-relative"
                    style={{ borderLeft: "5px solid #e53935" }}
                  >
                    {renderOrderRow(hd, userData)}
                    <div
                      className="d-flex justify-content-end align-items-center mt-2"
                      style={{ fontSize: 13, color: "#e53935" }}
                    >
                      <i className="bi bi-x-octagon me-1"></i>
                      Đơn hàng đã huỷ
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có hóa đơn đã huỷ.</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonHang;
