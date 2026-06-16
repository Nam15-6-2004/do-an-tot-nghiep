import request from "../utils/request";

export const login = async (taiKhoan, matKhau) => {
  try {
    const response = await request.post("auth/login", { taiKhoan, matKhau });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Đăng nhập thất bại!";
  }
};

export const googleLogin = async (token) => {
  try {
    const response = await request.post("auth/google-login", { token });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Đăng nhập Google thất bại!";
  }
};
