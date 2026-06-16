import LayoutDefault from "../Layout/LayoutDefault";
import DangKy from "../pages/DangKy";
import DangNhap from "../pages/DangNhap";
import TrangChu from "../pages/TrangChu";
import SanPham from "../pages/SanPham";
import Error404 from "../pages/Error404/Error404";
import GioHang from "../pages/GioHang";
import ProductDetail from "../components/Product/ProductDetail";
import LayoutAdmin from "../Layout/LayoutAdmin";
import TongQuanAdmin from "../pages/Admin/TongQuanAdmin";
import DanhMucAdmin from "../pages/Admin/DanhMucAdmin";
import SanPhamAdmin from "../pages/Admin/SanPhamAdmin";
import { Navigate } from "react-router-dom";
import ThanhToan from "../pages/ThanhToan";
import NhaCungCapAdmin from "./../pages/Admin/NhaCungCapAdmin/index";
import HoaDonBanAdmin from "../pages/Admin/HoaDonBanAdmin";
import HoSoAdmin from "./../pages/Admin/HoSoAdmin/index";
import HoaDonNhapAdmin from "../pages/Admin/HoaDonNhapAdmin";
import TaiKhoanAdmin from "../pages/Admin/TaiKhoanAdmin";
import HoSo from "../pages/HoSo";
import ThongTin from "./../pages/HoSo/thongTin";
import DoiPass from "./../pages/HoSo/doiPass";
import YeuThich from "./../pages/HoSo/yeuThich";
import DonHang from "./../pages/HoSo/donHang";
import HeThongCuaHang from "../pages/HeThongCuaHang";
import QuenMatKhau from "../pages/QuenMatKhau";
import PaymentResultPage from "../pages/payment-result";
import HoanThanh from "../pages/HoSo/hoanThanh";

export const routes = [
  // user
  {
    path: "/",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <TrangChu />,
      },
      {
        path: "dang-nhap",
        element: <DangNhap />,
      },
      {
        path: "dang-ky",
        element: <DangKy />,
      },
      {
        path: "san-pham",
        element: <SanPham />,
        children: [
          {
            path: ":id",
            element: <ProductDetail />,
          },
        ],
      },
      {
        path: "gio-hang",
        element: <GioHang />,
      },
      {
        path: "thanh-toan",
        element: <ThanhToan />,
      },
      {
        path: "payment-result",
        element: <PaymentResultPage />,
      },

      {
        path: "ho-so",
        element: <HoSo />,
        children: [
          { index: true, element: <Navigate to="thong-tin" /> },
          { path: "thong-tin", element: <ThongTin /> },
          { path: "doi-mat-khau", element: <DoiPass /> },
          { path: "sp-yeu-thich", element: <YeuThich /> },
          { path: "ls-don-hang", element: <DonHang /> },
        ],
      },
      { path: "hoan-thanh", element: <HoanThanh /> },
      {
        path: "he-thong-cua-hang",
        element: <HeThongCuaHang />,
      },
      {
        path: "quen-mat-khau",
        element: <QuenMatKhau />,
      },
    ],
  },
  // admin
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { path: "", element: <Navigate to="tong-quan" replace /> },
      {
        path: "tong-quan",
        element: <TongQuanAdmin />,
      },
      {
        path: "danh-muc-admin",
        element: <DanhMucAdmin />,
      },
      {
        path: "san-pham-admin",
        element: <SanPhamAdmin />,
      },
      {
        path: "ho-so-admin",
        element: <HoSoAdmin />,
      },
      {
        path: "nha-cung-cap-admin",
        element: <NhaCungCapAdmin />,
      },
      {
        path: "don-xuat-admin",
        element: <HoaDonBanAdmin />,
      },
      {
        path: "don-nhap-admin",
        element: <HoaDonNhapAdmin />,
      },
      {
        path: "tai-khoan-admin",
        element: <TaiKhoanAdmin />,
      },
    ],
  },
  // error
  {
    path: "*",
    element: <Error404 />,
  },
];
