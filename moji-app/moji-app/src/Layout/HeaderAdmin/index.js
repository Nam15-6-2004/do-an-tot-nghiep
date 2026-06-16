import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./HeaderAdmin.scss";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/nguoiDungService";

function HeaderAdmin({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [userImg, setUserImg] = useState("/image/admin.jpg");
  const taiKhoan = localStorage.getItem("taiKhoan");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!taiKhoan) return;

      try {
        const users = await getAllUsers();
        const user = users.find((u) => u.taiKhoan === taiKhoan);

        if (user?.anhThe?.length > 0) {
          setUserImg(`http://localhost:3001${user.anhThe[0]}`);
        }
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin người dùng:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserData();
  }, [taiKhoan]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("taiKhoan");
    navigate("/");
  };

  return (
    <div className="header-admin">
      <div className="header-left">
        <i className="bi bi-list menu-icon" onClick={toggleSidebar} />
        <img className="logo" src="/image/logo.png" alt="Logo" />
      </div>

      <div className="header-center">
        <div className="contact-info">
          <Link to="#!" className="contact-item">
            <i className="bi bi-envelope-at-fill" />
            NLShop@gmail.com
          </Link>
          <Link to="#!" className="contact-item">
            <i className="bi bi-telephone-inbound-fill" />
            0973 812 204
          </Link>
        </div>
      </div>

      <div className="header-right">
        <Link
          className="nav-link"
          to="https://vercel.com/ahihis-projects-13d175bf"
          target="_blank"
        >
          <i className="bi bi-palette"></i>
        </Link>
        <Link
          className="nav-link"
          to="https://github.com/Nam15-6-2004"
          target="_blank"
        >
          <i className="bi bi-github"></i>
        </Link>

        {/* Dropdown Avatar */}
        <div className="user-dropdown">
          <button
            className="avatar-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img
              src={userImg}
              alt="Avatar"
              onError={() => setUserImg("/image/admin.jpg")}
            />
            <i className="bi bi-caret-down-fill dropdown-icon ms-1"></i>
          </button>

          {showDropdown && (
            <ul className="dropdown-menu show">
              <li>
                <Link className="dropdown-item" to="/admin/ho-so-admin">
                  <i className="bi bi-person-circle"></i> Hồ sơ
                </Link>
              </li>
              <li>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Đăng xuất
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderAdmin;
