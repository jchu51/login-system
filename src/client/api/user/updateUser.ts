import { IUser } from "../../contexts/authContext";
import { userInstance } from "../utils/index";

const updateUser = async (token: string, data: Partial<IUser>) => {
  const result = await userInstance({
    headers: { authorization: `Bearer ${token}` },
  }).put("/update", data);

  return result.data;
};

export default updateUser;
