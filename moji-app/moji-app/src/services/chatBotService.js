import request from "../utils/request";

export const chatBot = async (data) => {
  const response = await request.post("gemini/chat", data);
  return response.data;
};
