import { Request, Response } from "express";
import { authenticator } from "otplib";
import omit from "lodash/omit";

import generateBearerToken from "../../utils/auth/generateBearerToken";

import User from "../../models/user";

const verifyOtp = async (req: Request, res: Response) => {
  try {
    const user = req.currentUser;

    const mfaToken = req.currentUser.mfaToken || req.session.mfaToken;
    const isValid = authenticator.check(req.body.token, mfaToken);

    if (isValid) {
      let userData = user;
      // first time enable
      if (!req.currentUser.mfaEnabled) {
        userData = await User.findOneAndUpdate(
          { _id: user._id },
          {
            mfaEnabled: true,
            mfaToken: req.session.mfaToken,
          },
          { new: true }
        );
      }
      const accessToken = generateBearerToken(user._id);
      req.session.accessToken = accessToken;

      userData = omit(userData.toJSON(), ["password"]);
      res.cookie("token", { user: userData, accessToken });

      return res.status(200).send({
        success: true,
        data: { user: userData, accessToken },
        message: "Vertify Successful",
      });
    } else {
      return res.status(400).send({
        success: true,
        message: "Failed to update user",
      });
    }
  } catch (err) {
    console.error(`Failed to verifyOtp  ${err}`);

    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

export default verifyOtp;
