import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import DangKy from "../DangKy";
import { login } from "../../services/authService";
import "./DangNhap.scss";

function DangNhap() {
  // Chuyển giữa đăng nhập và đăng ký
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "login") {
      navigate("/dang-nhap");
    } else {
      navigate("/dang-ky");
    }
  }, [activeTab, navigate]);

  // State đăng nhập
  const [taiKhoan, setTaiKhoan] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!taiKhoan.trim() || !matKhau.trim()) {
      setError("Vui lòng nhập tài khoản và mật khẩu!");
      return;
    }
    try {
      const data = await login(taiKhoan, matKhau);
      localStorage.setItem("token", data.token);
      localStorage.setItem("taiKhoan", taiKhoan);

      const tokenParts = data.token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));

      if (payload.maVT === "A00") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (err) {
      setError("Tài khoản hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ width: "500px" }}>
      <div className="card">
        <div className="card-header d-flex justify-content-center">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                ĐĂNG NHẬP
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "register" ? "active" : ""
                }`}
                onClick={() => setActiveTab("register")}
              >
                ĐĂNG KÝ
              </button>
            </li>
          </ul>
        </div>

        <div className="card-body">
          {error && <p className="text-danger text-center">{error}</p>}

          {activeTab === "login" ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập email hoặc tên đăng nhập"
                  value={taiKhoan}
                  onChange={(e) => setTaiKhoan(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu"
                  value={matKhau}
                  onChange={(e) => setMatKhau(e.target.value)}
                  required
                />
              </div>
              <button className="btn-dangNhap w-100 mt-1" onClick={handleLogin}>
                ĐĂNG NHẬP
              </button>
              <div className="text-center mt-3 chuc-nang">
                <Link to="/quen-mat-khau" className="item-link">
                  Quên mật khẩu?
                </Link>
                <p>Hoặc đăng nhập với</p>
                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() =>
                    (window.location.href =
                      "https://www.facebook.com/binh.luongthanh.739/")
                  }
                >
                  <i className="bi bi-facebook me-2"></i>
                  Đăng nhập bằng Facebook
                </button>

                <button className="btn btn-danger w-100">
                  <i className="bi bi-google me-2"></i>
                  Đăng nhập bằng Google
                </button>
              </div>
            </form>
          ) : (
            <DangKy />
          )}
        </div>
      </div>
    </div>
  );
}

export default DangNhap;
