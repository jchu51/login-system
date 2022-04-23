import { Request, Response } from "express";
import bcrypt from "bcrypt";
import omit from "lodash/omit";
import User from "../../models/user";
import generateBearerToken from "../../utils/auth/generateBearerToken";

/**
 * This function help to return the user infomation,
 * it will also update the session token
 *
 * @param req
 * @param res
 * @returns {object}
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { body } = req;
    if (!body)
      return res.status(400).send({ success: false, message: "No body" });

    const { password, email }: { password: string; email: string } = body;

    const user = await User.findOne({ email });

    //check is user exist
    if (!user)
      return res
        .status(404)
        .send({ success: false, message: "Username or Password is wrong" });
    const match = await bcrypt.compare(password, user.password);

    //check is password correct
    if (!match)
      return res
        .status(404)
        .send({ success: false, message: "Username or Password is wrong" });

    //Generate new bearer token
    const accessToken = generateBearerToken(user._id);
    req.session.accessToken = accessToken;
    // if user already enable mfa, then dont send user and accesstoken back
    if (user.mfaEnabled) {
      return res.status(200).send({
        success: true,
        data: { user: { mfaEnabled: true }, accessToken },
      });
    }

    const userData = omit(user.toJSON(), ["password"]);
    res.cookie("token", { user: userData, accessToken });

    return res.status(200).send({
      success: true,
      data: { user: userData, accessToken },
    });
  } catch (err) {
    console.error(`Failed to login: ${err}`);

    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

export default login;
