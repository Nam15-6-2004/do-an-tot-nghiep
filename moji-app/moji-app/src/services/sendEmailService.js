import request from "../utils/request";

export const sendEmail = async (data) => {
  const response = await request.post("email/send-bill", data);
  return response.data;
};
