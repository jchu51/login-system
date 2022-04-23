import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import User from "../models/user";

/**
 * Middleware to check the user has the correct token, to access other data
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"];
  const { skipAuthCheck = false } = req.body;
  let token;

  if (skipAuthCheck) {
    next();
  }

  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
  }

  // check client token is same as backend session token
  if (token === req.session?.accessToken) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        res.clearCookie("sessionToken");
        return res.status(401).json({ message: "failed to authenticate" });
      } else {
        const user = await User.findOne({ _id: decoded.sub }).select({
          _id: 1,
          email: 1,
          username: 1,
          mfaEnabled: 1,
          mfaToken: 1,
        });

        if (!user) return res.status(404).json({ message: "User Not Found" });

        req.currentUser = user;

        next();
      }
    });
  } else {
    await req.session.destroy((err) => {
      if (err) {
        console.log("Failed to destroy session ", err);
      }
      res.clearCookie("sessionToken");
      res.clearCookie("token");

      return res.status(403).json({ message: "No token provided" });
    });
  }
};
