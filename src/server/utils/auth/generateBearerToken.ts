import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const generateBearerToken = (userId: Types.ObjectId) => {
  return jwt.sign(
    {
      sub: userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 100000000 }
  );
};

export default generateBearerToken;
