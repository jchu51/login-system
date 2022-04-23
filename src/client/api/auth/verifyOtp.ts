import { userInstance } from "../utils/index";

const verifyOtp = async (
  token: string,
  data: { token: string; skipAuthCheck?: boolean }
) => {
  const result = await userInstance({
    headers: { authorization: `Bearer ${token}` },
  }).post("/verifyOtp", data);

  return result.data;
};

export default verifyOtp;
