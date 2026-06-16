import { useEffect, useState } from "react";
import { getUserById, updateUser } from "../../services/nguoiDungService";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function ThongTin() {
  const [tinh, setTinh] = useState([]);
  const [huyen, setHuyen] = useState([]);
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedHuyen, setSelectedHuyen] = useState("");

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
  // update
  const Navigate = useNavigate();
  // Hàm kiểm tra email
  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  }

  // Hàm kiểm tra số điện thoại
  function isValidPhone(sdt) {
    return /^0\d{9}$/.test(sdt);
  }
  const handleUpdateUser = async () => {
    if (
      !userData.tenND ||
      !userData.ngaySinh ||
      !userData.sdt ||
      !userData.email ||
      !userData.diaChi ||
      !selectedTinh ||
      !selectedHuyen
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (!isValidEmail(userData.email)) {
      alert("Email không hợp lệ. Email có định dạng 'abc@gmail.com'.");
      return;
    }

    if (!isValidPhone(userData.sdt)) {
      alert("Số điện thoại không hợp lệ. Phải bắt đầu từ số 0 và có 10 số.");
      return;
    }
    try {
      const tenTinhObj = tinh.find((t) => t.code === Number(selectedTinh));
      const tenTinh = tenTinhObj ? tenTinhObj.name : "";

      const tenHuyenObj = huyen.find((h) => h.code === Number(selectedHuyen));
      const tenHuyen = tenHuyenObj ? tenHuyenObj.name : "";

      const diaChi = [userData.diaChi, tenHuyen, tenTinh]
        .filter((part) => part)
        .join(", ");

      await updateUser({
        ...userData,
        diaChi: diaChi,
        maTinh: selectedTinh,
        maHuyen: selectedHuyen,
      });
      Navigate("/ho-so");
      alert("Cập nhật thành công!");
    } catch (error) {
      alert("Lỗi cập nhật user: ", error);
    }
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [id]: value }));
  };
  if (!userData) {
    return <p>Loading...</p>;
  }
  return (
    <div className="content">
      <h5 className="fw-bold">HỒ SƠ CỦA TÔI</h5>
      <p className="description mb-3">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </p>
      <hr />
      <form>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="tenND"
          >
            Họ tên:
            <span class="required-star"> (*) </span>
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="tenND"
              type="text"
              value={userData.tenND}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="ngaySinh"
          >
            Ngày sinh:
            <span class="required-star"> (*) </span>
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="ngaySinh"
              placeholder="dd/mm/yyyy"
              type="date"
              value={userData.ngaySinh}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="sdt"
          >
            Điện thoại:
            <span class="required-star"> (*) </span>
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="sdt"
              placeholder="Điện thoại"
              type="text"
              value={userData.sdt}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="email"
          >
            Email:
            <span class="required-star"> (*) </span>
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="email"
              type="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="inputProvince"
          >
            Tỉnh/Thành phố :<span class="required-star"> (*) </span>
          </label>
          <div class="col-sm-7 col-12">
            <select
              className="form-select"
              id="inputProvince"
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
        </div>
        <div class="row mb-3 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="inputDistrict"
          >
            Quận/ Huyện:
            <span class="required-star"> (*) </span>
          </label>
          <div class="col-sm-7 col-12">
            <select
              className="form-select"
              id="inputDistrict"
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
        </div>
        <div class="row mb-4 align-items-center">
          <label
            class="col-sm-3 col-form-label text-sm-end form-label"
            for="diaChi"
          >
            Địa chỉ chi tiết:
            <span class="required-star"> (*) </span>
          </label>
          <div class="col-sm-7 col-12">
            <input
              class="form-control"
              id="diaChi"
              placeholder="Địa chỉ chi tiết"
              type="text"
              value={userData.diaChi}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="col-sm-7 col-12 d-flex justify-content-start ps-sm-0 ps-3">
            <button
              class="btn btn-update"
              type="button"
              onClick={handleUpdateUser}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default ThongTin;
