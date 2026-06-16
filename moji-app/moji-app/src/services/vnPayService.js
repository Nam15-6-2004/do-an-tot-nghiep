import request from "../utils/request";

export const createPaymentUrl = async (data) => {
  const response = await request.post("vn_pay/create_payment_url", data);
  return response.data;
};
