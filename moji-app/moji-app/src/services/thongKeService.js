import request from "../utils/request";

export const getAllThongKeDoanhThu = async () => {
  const response = await request.get("thongke/alltongtien");
  return response.data;
};
export const getAllThongKeSoLuongHDB = async () => {
  const response = await request.get("thongke/allsoluonghdb");
  return response.data;
};
export const getAllThongKeSoLuongHDBChuaDuyet = async () => {
  const response = await request.get("thongke/allsoluonghdbchuaduyet");
  return response.data;
};
export const getAllThongKeSoLuongSPNhoHon5 = async () => {
  const response = await request.get("sanpham/sosanphamnhohon5");
  return response.data;
};
export const getAllThongKeDoanhThu7Ngay = async () => {
  const response = await request.get("thongke/doanhthutheongay");
  return response.data;
};
export const getAllThongKeTop5DanhMucBanChay = async () => {
  const response = await request.get("thongke/topdanhmucbanchay");
  return response.data;
};

export const getPhanLoaiTrangThai = async () => {
  const response = await request.get("hoadonban/phanloaitrangthai");
  return response.data;
};
