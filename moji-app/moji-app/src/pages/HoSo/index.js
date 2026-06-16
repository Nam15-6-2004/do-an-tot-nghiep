import { Link, NavLink, Outlet } from "react-router-dom";
import "./HoSo.scss";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getUserById, updateUser } from "../../services/nguoiDungService";

function HoSo() {
  const handleLogout = () => {
    localStorage.removeItem("taiKhoan");
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const [userData, setUserData] = useState(null);
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

  return (
    <div className="container  ho-so-user">
      <div className="row mt-4">
        <div className="caption d-flex">
          <Link to="/">Trang chủ</Link>
          <span className="muiTen mx-2">{">"}</span>
          <Link to="/ho-so">Hồ sơ</Link>
          <span className="muiTen mx-2">{">"}</span>
          <p className="titleDetail">Thông tin cá nhân</p>
        </div>
      </div>
      <div className="row justify-content-center mt-2 mb-5">
        {/* Sidebar */}
        <div className="col-12 col-md-3 mb-4 mb-md-0">
          <div className="sidebar1 d-flex flex-column align-items-center text-center p-3">
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                alt="avatar"
                className="logo rounded-circle"
                height={120}
                width={120}
                src={
                  userData?.anhThe && userData.anhThe.length > 0
                    ? `http://localhost:3001${userData.anhThe[0]}`
                    : "/default-avatar.jpg"
                }
              />
              <label
                htmlFor="upload-avatar"
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 8,
                  background: "#ED6E94",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <i className="bi bi-camera"></i>
                <input
                  id="upload-avatar"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append("images", file);
                      try {
                        const response = await fetch(
                          "http://localhost:3001/api/upload",
                          {
                            method: "POST",
                            body: formData,
                          }
                        );
                        if (!response.ok)
                          throw new Error("Upload ảnh thất bại");
                        const data = await response.json();
                        const imagePath = data.imageUrls?.[0];
                        if (imagePath) {
                          setUserData((prev) => ({
                            ...prev,
                            anhThe: [imagePath],
                          }));
                          // Gọi API cập nhật user
                          if (userData && userData.maND) {
                            await updateUser({
                              ...userData,
                              anhThe: [imagePath],
                            });
                          }
                        }
                      } catch (err) {
                        alert("Lỗi upload ảnh: " + err.message);
                      }
                    }
                  }}
                />
              </label>
            </div>

            <h5 className="mt-2 mb-3 fw-bold">{userData?.taiKhoan}</h5>

            <nav className="nav flex-column w-100 ">
              <NavLink className="nav-link ps-1" to="thong-tin">
                Thông tin tài khoản
              </NavLink>
              <NavLink className="nav-link ps-1" to="doi-mat-khau">
                Đổi mật khẩu
              </NavLink>
              <NavLink className="nav-link ps-1" to="ls-don-hang">
                Lịch sử đơn hàng
              </NavLink>
              <NavLink className="nav-link ps-1" to="sp-yeu-thich">
                Sản phẩm yêu thích
              </NavLink>
              <button className="nav-link ps-1" onClick={handleLogout}>
                Đăng Xuất
              </button>
            </nav>
          </div>
        </div>

        <div className="col-12 col-md-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default HoSo;
