import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getRolegetById,
  getUserById,
  updateUser,
} from "../../../services/nguoiDungService";
import { jwtDecode } from "jwt-decode";
import { updatePassword } from "./../../../services/nguoiDungService";
import "./HoSoAdmin.scss";

function HoSoAdmin() {
  if (!localStorage.getItem("token")) {
    window.location.replace("/dang-nhap");
  }
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
  const [tenVT, setTenVT] = useState("");
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

        if (user.maVT) {
          const roleName = await getRolegetById(user.maVT);
          setTenVT(roleName);
        }
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin người dùng:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserData();
  }, [token]);
  const getUserImage = (imageArray) => {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      const raw = imageArray[0] || "";
      const path = raw.startsWith("/") ? raw : `/${raw}`;
      return `http://localhost:3001${path}`;
    }
    return "/image/admin.jpg";
  };

  // đổi pass
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const Navigate = useNavigate();

  const handleUpdatePassword = async () => {
    if (newPass !== confirmPass) {
      alert("Mật khẩu mới và xác nhận không khớp!");
      return;
    }
    if (!currentPass || !newPass || !confirmPass) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const taiKhoan = localStorage.getItem("taiKhoan");
    if (!taiKhoan) {
      alert("Không tìm thấy tài khoản trong localStorage!");
      return;
    }

    const data = {
      taiKhoan: taiKhoan,
      matKhauCu: currentPass,
      matKhauMoi: newPass,
    };

    try {
      await updatePassword(data);
      alert("Đổi mật khẩu thành công!");
      localStorage.removeItem("taiKhoan");
      localStorage.removeItem("token");
      Navigate("/dang-nhap");

      // Reset
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  // chọn ảnh đại diện mới (chỉ 1 ảnh)
  const [previewUrl, setPreviewUrl] = useState("");

  // Hàm upload 1 ảnh đại diện
  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview ảnh
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload ảnh lên server
    const formDataUpload = new FormData();
    formDataUpload.append("images", file);
    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      if (!response.ok) throw new Error("Upload ảnh thất bại");
      const data = await response.json();
      const imagePath = data.imageUrls?.[0];
      if (imagePath) {
        setUserData((prev) => ({
          ...prev,
          anhThe: [imagePath],
        }));
      }
    } catch (err) {
      alert("Lỗi upload ảnh: " + err.message);
    }
  };

  // update
  const handleUpdateUser = async () => {
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
      //window.location.reload();
    } catch (error) {
      alert("lỗi sửa user: ", error);
    }
  };

  const handleInputChage = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (!userData) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <>
      {/* Profile 1 - Bootstrap Brain Component */}
      <section className="bg-light py-1 py-md-5 py-xl-3 ho-so-ne">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
              <h2 className="mb-4 text-center title-text-main">
                Hồ sơ cá nhân
              </h2>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row gy-4 gy-lg-0">
            <div className="col-12 col-lg-4 col-xl-3">
              <div className="row gy-4">
                <div className="col-12">
                  <div className="card widget-card border-light shadow-sm">
                    <div className="card-header text-bg-primary">
                      Welcome, {userData.tenND}
                    </div>
                    <div className="card-body">
                      <div className="text-center mb-3">
                        <img
                          className="img-to"
                          src={getUserImage(userData.anhThe)}
                          alt={userData.tenND}
                          onError={(e) => (e.currentTarget.src = "/image/admin.jpg")}
                        />
                      </div>
                      <h5 className="text-center mb-1">{userData.tenND}</h5>
                      <p className="text-center text-secondary mb-4">
                        Project Manager
                      </p>
                      <ul className="list-group list-group-flush mb-4">
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <h6 className="m-0">Followers</h6>
                          <span>1m5</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <h6 className="m-0">Following</h6>
                          <span>5000</span>
                        </li>
                        <li className="list-group-item d-flex justify-content-between align-items-center">
                          <h6 className="m-0">Friends</h6>
                          <span>4,620</span>
                        </li>
                      </ul>
                      <div className="d-grid m-0">
                        <button
                          className="btn btn-outline-primary"
                          type="button"
                        >
                          Follow
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card widget-card border-light shadow-sm">
                    <div className="card-header text-bg-primary">
                      Social Accounts
                    </div>
                    <div className="card-body text-center">
                      <Link
                        to="#!"
                        className="d-inline-block bg-dark link-light lh-1 p-2 rounded me-2"
                      >
                        <i className="bi bi-youtube" />
                      </Link>
                      <Link
                        to="#!"
                        className="d-inline-block bg-dark link-light lh-1 p-2 rounded me-2"
                      >
                        <i className="bi bi-twitter-x" />
                      </Link>
                      <Link
                        to="#!"
                        className="d-inline-block bg-dark link-light lh-1 p-2 rounded me-2"
                      >
                        <i className="bi bi-facebook" />
                      </Link>
                      <Link
                        to="#!"
                        className="d-inline-block bg-dark link-light lh-1 p-2 rounded"
                      >
                        <i className="bi bi-linkedin" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card widget-card border-light shadow-sm">
                    <div className="card-header text-bg-primary">About Me</div>
                    <div className="card-body">
                      <ul className="list-group list-group-flush mb-0">
                        <li className="list-group-item">
                          <h6 className="mb-1">
                            <span className="bii bi-mortarboard-fill me-2" />
                            Education
                          </h6>
                          <span>Web technology student</span>
                        </li>
                        <li className="list-group-item">
                          <h6 className="mb-1">
                            <span className="bii bi-geo-alt-fill me-2" />
                            Location
                          </h6>
                          <span>Hung Yen, Vietnam</span>
                        </li>
                        <li className="list-group-item">
                          <h6 className="mb-1">
                            <span className="bii bi-building-fill-gear me-2" />
                            Company
                          </h6>
                          <span>GitHub Ahhinhlll</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card widget-card border-light shadow-sm">
                    <div className="card-header text-bg-primary">Skills</div>
                    <div className="card-body text-center">
                      <span className="badge text-bg-primary me-2">HTML</span>
                      <span className="badge text-bg-primary  me-2">SCSS</span>
                      <span className="badge text-bg-primary  me-2">
                        Javascript
                      </span>
                      <span className="badge text-bg-primary">React</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-8 col-xl-9">
              <div className="card widget-card border-light shadow-sm">
                <div className="card-body p-4">
                  <ul
                    className="nav nav-tabs custom-tabs"
                    id="profileTab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="overview-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#overview-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="overview-tab-pane"
                        aria-selected="true"
                      >
                        Overview
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="profile-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#profile-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="profile-tab-pane"
                        aria-selected="false"
                      >
                        Profile
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="password-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#password-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="password-tab-pane"
                        aria-selected="false"
                      >
                        Password
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content pt-4" id="profileTabContent">
                    {/* tab tổng quan */}
                    <div
                      className="tab-pane fade show active"
                      id="overview-tab-pane"
                      role="tabpanel"
                      aria-labelledby="overview-tab"
                      tabIndex={0}
                    >
                      <h5 className="mb-3">Profile</h5>
                      <div className="row g-0">
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">User Name</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{userData.taiKhoan}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Full Name</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{userData.tenND}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Birthday</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">
                            {new Date(userData.ngaySinh).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Phone</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{userData.sdt}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Email</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{userData.email}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Address</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{userData.diaChi}</div>
                        </div>
                        <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                          <div className="p-2">Role</div>
                        </div>
                        <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                          <div className="p-2">{tenVT || "Loading ...."}</div>
                        </div>
                      </div>
                    </div>

                    {/* tab cập nhật thông tin  */}
                    <div
                      className="tab-pane fade"
                      id="profile-tab-pane"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                      tabIndex={0}
                    >
                      <form action="#!" className="row gy-3 gy-xxl-4">
                        <div className="col-12">
                          <div className="container-fluid">
                            <div className="row gy-2">
                              <div className="col-md-3 gap-2 d-flex flex-column align-items-center">
                                <label className="form-label m-0">
                                  Profile Image
                                </label>
                                <div className="selected-images mb-1">
                                  <img
                                    src={
                                      previewUrl
                                        ? previewUrl
                                        : Array.isArray(userData.anhThe) &&
                                          userData.anhThe.length > 0
                                        ? getUserImage(userData.anhThe)
                                        : "/image/admin.jpg"
                                    }
                                    alt="Avatar"
                                    className="img-fluid img-be rounded-circle border"
                                    style={{
                                      width: 120,
                                      height: 120,
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => (e.currentTarget.src = "/image/admin.jpg")}
                                  />
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="form-control"
                                  onChange={handleAvatarFileSelect}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <label htmlFor="taiKhoan" className="form-label">
                            User Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="taiKhoan"
                            defaultValue={userData.taiKhoan}
                            readOnly
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <label htmlFor="tenND" className="form-label">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="tenND"
                            value={userData.tenND}
                            onChange={handleInputChage}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="ngaySinh" className="form-label">
                            Birthday
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="ngaySinh"
                            value={userData.ngaySinh}
                            onChange={handleInputChage}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="sdt" className="form-label">
                            Phone
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="sdt"
                            value={userData.sdt}
                            onChange={handleInputChage}
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={userData.email}
                            onChange={handleInputChage}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="inputProvince" className="form-label">
                            Province
                          </label>
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
                        <div className="col-12 col-md-6">
                          <label htmlFor="diaChi" className="form-label">
                            Address
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="diaChi"
                            value={userData.diaChi}
                            onChange={handleInputChage}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="inputDistrict" className="form-label">
                            District
                          </label>
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
                        <div className="col-12 col-md-6">
                          <label htmlFor="matKhau" className="form-label">
                            Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="matKhau"
                            defaultValue={userData.matKhau}
                            readOnly
                          />
                        </div>

                        <div className="col-12 col-md-6">
                          <label htmlFor="maVT" className="form-label">
                            Role
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="maVT"
                            defaultValue={tenVT}
                            readOnly
                          />
                        </div>

                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpdateUser}
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* tab đổi mật khẩu trang đổi mật khẩu */}
                    <div
                      className="tab-pane fade"
                      id="password-tab-pane"
                      role="tabpanel"
                      aria-labelledby="password-tab"
                      tabIndex={0}
                    >
                      <form action="#!">
                        <div className="row gy-3 gy-xxl-4">
                          <div className="col-12">
                            <label
                              htmlFor="currentPassword"
                              className="form-label"
                            >
                              Current Password
                            </label>
                            <input
                              //type="password"
                              className="form-control"
                              id="currentPassword"
                              value={currentPass}
                              onChange={(e) => setCurrentPass(e.target.value)}
                            />
                          </div>
                          <div className="col-12">
                            <label htmlFor="newPassword" className="form-label">
                              New Password
                            </label>
                            <input
                              //type="password"
                              className="form-control"
                              id="newPassword"
                              value={newPass}
                              onChange={(e) => setNewPass(e.target.value)}
                            />
                          </div>
                          <div className="col-12">
                            <label
                              htmlFor="confirmPassword"
                              className="form-label"
                            >
                              Confirm Password
                            </label>
                            <input
                              //type="password"
                              className="form-control"
                              id="confirmPassword"
                              value={confirmPass}
                              onChange={(e) => setConfirmPass(e.target.value)}
                            />
                          </div>
                          <div className="col-12">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleUpdatePassword}
                            >
                              Change Password
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HoSoAdmin;
