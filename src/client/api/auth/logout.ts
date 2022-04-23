import { userInstance } from "../utils/index";

const logout = async () => {
  const result = await userInstance().get("/logout");

  return result.data;
};

export default logout;
