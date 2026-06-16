import request from "../utils/request";

export const getAllProducts = async () => {
  const response = await request.get("sanpham/getall");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await request.get(`sanpham/getbyid/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await request.post("sanpham/insert", data);
  return response.data;
};

export const updateProduct = async (data) => {
  const response = await request.put("sanpham/update", data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await request.delete(`sanpham/delete/${id}`);
  return response.data;
};

export const searchProducts = async (query) => {
  const response = await request.get(`sanpham/search?q=${query}`);
  return response.data;
};

export const getSelectGiaTien = async (query) => {
  const response = await request.get(`sanpham/giatien?sapXep=${query}`);
  return response.data;
};
export const getTheoGiaTien = async (query) => {
  const response = await request.get(`sanpham/theogia?giaTien=${query}`);
  return response.data;
};
