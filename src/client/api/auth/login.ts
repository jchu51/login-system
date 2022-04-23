import { userInstance } from "../utils/index";

const login = async (data: { password: string; email: string }) => {
  const result = await userInstance().post("/login", data);

  return result.data;
};

export default login;
