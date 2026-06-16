import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import DangNhap from "../DangNhap";
import "./DangKy.scss";
import { createUser } from "../../services/nguoiDungService";

function DangKy() {
  const [activeTab, setActiveTab] = useState("register");
  const [tinh, setTinh] = useState([]);
  const [huyen, setHuyen] = useState([]);
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedHuyen, setSelectedHuyen] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "register") {
      navigate("/dang-ky");
    } else {
      navigate("/dang-nhap");
    }
  }, [activeTab, navigate]);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => setTinh(data))
      .catch((error) => console.log("Lỗi gọi tỉnh: ", error));
  }, []);

  useEffect(() => {
    if (selectedTinh) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedTinh}?depth=2`)
        .then((res) => res.json())
        .then((data) => setHuyen(data.districts))
        .catch((error) => console.log("Lỗi gọi huyện: ", error));
    } else {
      setHuyen([]);
    }
  }, [selectedTinh]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (
      !formData.username ||
      !formData.fullName ||
      !formData.dob ||
      !formData.phone ||
      !formData.email ||
      !selectedTinh ||
      !selectedHuyen ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Số điện thoại có định dạng : 0987654321");
      return;
    }

    if (!formData.email.includes("@gmail.com")) {
      setError("Email có định dạng 'abc@gmail.com'!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Tìm tên tỉnh/thành phố
    const tenTinhObj = tinh.find((t) => t.code === Number(selectedTinh));
    const tenTinh = tenTinhObj ? tenTinhObj.name : "";

    // Tìm tên huyện/quận
    const tenHuyenObj = huyen.find((h) => h.code === Number(selectedHuyen));
    const tenHuyen = tenHuyenObj ? tenHuyenObj.name : "";

    // Gộp địa chỉ
    const diaChi = [formData.address, tenHuyen, tenTinh]
      .filter((part) => part)
      .join(", ");

    const user = {
      taiKhoan: formData.username,
      tenND: formData.fullName,
      ngaySinh: formData.dob,
      sdt: formData.phone,
      email: formData.email,
      diaChi,
      matKhau: formData.password,
    };

    try {
      const data = await createUser(user);
      console.log("Đăng ký: ", data);
      alert("Đăng ký thành công!");
      navigate("/dang-nhap");
    } catch (error) {
      console.log("Lỗi khi đăng ký: ", error);
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
          {activeTab === "login" ? (
            <DangNhap />
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên đăng nhập (*)"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Họ tên (*)"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Điện thoại (*)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email (*)"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-control"
                  value={selectedTinh}
                  onChange={(e) => setSelectedTinh(e.target.value)}
                >
                  <option value="">Tỉnh/Thành phố *</option>
                  {tinh.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <select
                  className="form-control"
                  value={selectedHuyen}
                  onChange={(e) => setSelectedHuyen(e.target.value)}
                  disabled={!selectedTinh}
                >
                  <option value="">Quận/Huyện *</option>
                  {huyen.map((h) => (
                    <option key={h.code} value={h.code}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Địa chỉ chi tiết (*)"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mật khẩu của bạn (*)"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu (*)"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <p className="text-danger">{error}</p>}
              <button
                type="button"
                className="btn-dangKy w-100"
                onClick={handleRegister}
              >
                ĐĂNG KÝ
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default DangKy;
