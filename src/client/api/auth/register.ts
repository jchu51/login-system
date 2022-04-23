import { userInstance } from "../utils/index";

const register = async (data: {
  password: string;
  confirmPassword: string;
  email: string;
  username: string;
}) => {
  const result = await userInstance().post("/register", data);

  return result.data;
};

export default register;
