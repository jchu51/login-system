import { userInstance } from "../utils/index";

const fetchGetQrCode = async (token: string) => {
  const result = await userInstance({
    headers: { authorization: `Bearer ${token}` },
  }).get("/mfaQrCode");

  return result.data;
};

export default fetchGetQrCode;
