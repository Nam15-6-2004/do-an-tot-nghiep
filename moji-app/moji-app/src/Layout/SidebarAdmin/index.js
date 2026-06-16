import { NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SidebarAdmin.scss";
import { useEffect, useState } from "react";

const SidebarAdmin = ({ isOpen }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);
  const menuItems = [
    {
      icon: "bi bi-person-circle",
      label: "Thông tin cá nhân",
      path: "/admin/ho-so-admin",
    },
    {
      icon: "bi bi-list-task",
      label: "Quản lý danh mục",
      path: "/admin/danh-muc-admin",
    },
    {
      icon: "bi bi-box-seam",
      label: "Quản lý sản phẩm",
      path: "/admin/san-pham-admin",
    },
    {
      icon: "bi bi-people",
      label: "Quản lý nhà cung cấp",
      path: "/admin/nha-cung-cap-admin",
    },
    {
      icon: "bi bi-receipt",
      label: "Quản lý hóa đơn bán",
      path: "/admin/don-xuat-admin",
    },
    {
      icon: "bi bi-clipboard-data",
      label: "Quản lý hóa đơn nhập",
      path: "/admin/don-nhap-admin",
    },
    {
      icon: "bi bi-person-lines-fill",
      label: "Quản lý tài khoản",
      path: "/admin/tai-khoan-admin",
    },
    {
      icon: "bi bi-bar-chart-line",
      label: "Tổng quan hệ thống",
      path: "/admin/tong-quan",
    },
  ];

  return (
    <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul className="nav-options">
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={`nav-option ${activePath === item.path ? "active" : ""}`}
          >
            <i className={`${item.icon} nav-img`} />
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </ul>
    </nav>
  );
};

export default SidebarAdmin;
