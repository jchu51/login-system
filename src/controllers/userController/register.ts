import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/user";
import generateBearerToken from "../../utils/auth/generateBearerToken";

/**
 * This function help to create new account, it will return user information and
 * create new session
 *
 * @param req
 * @param res
 * @returns
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { body } = req;

    if (!body) {
      return res.status(400).send({ success: false, message: "No body" });
    }

    //check validation

    //check password match
    const {
      password,
      confirmPassword,
      username,
      email,
    }: {
      password: string;
      confirmPassword: string;
      email: string;
      username: string;
    } = body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Password not match" });
    }

    // check Email already register
    if ((await User.find({ email: email }).count()) > 0)
      return res
        .status(400)
        .send({ success: false, message: "Email already register" });

    const hash = bcrypt.hashSync(password, process.env.SALT_ROUNDS);

    const date = new Date();

    const user = new User({
      email,
      username,
      password: hash,
      createdAt: date,
      updatedAt: date,
    });
    //save to session
    const accessToken = generateBearerToken(user._id);
    req.session.accessToken = accessToken;
    await user.save();

    return res.status(201).send({
      success: true,
      message: "Register successfully",
      data: user,
    });
  } catch (err) {
    console.error(`Failed to register: ${err}`);

    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

export default register;
