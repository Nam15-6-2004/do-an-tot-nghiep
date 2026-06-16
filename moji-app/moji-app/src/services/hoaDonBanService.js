import request from "../utils/request";

export const getAllCtBill = async () => {
  const response = await request.get("/cthoadonban/getall");
  return response.data;
};

export const getCtBillById = async (id) => {
  const response = await request.get(`/cthoadonban/getbyid/${id}`);
  return response.data;
};
export const getAllBill = async () => {
  const response = await request.get("/hoadonban/getall");
  return response.data;
};

export const getBillById = async (id) => {
  const response = await request.get(`/hoadonban/getbyid/${id}`);
  return response.data;
};

export const createBill = async (data) => {
  const response = await request.post("hoadonban/insert", data);
  return response.data;
};
export const updateBill = async (data) => {
  const response = await request.put("hoadonban/update", data);
  return response.data;
};
export const huyDonHang = async (data) => {
  const response = await request.put("hoadonban/huydonhang", data);
  return response.data;
};

export const deleteBill = async (id) => {
  const response = await request.delete(`hoadonban/delete/${id}`);
  return response.data;
};
export const searchBill = async (query) => {
  const response = await request.get(`hoadonban/search?q=${query}`);
  return response.data;
};
export const getHistoryBillByUser = async (id) => {
  const response = await request.get(`/hoadonban/user/${id}`);
  return response.data;
};
