import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import User from "../models/user";


/**
 * Middleware to check the user has the correct token, to access other data
 */
export default async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers["authorization"];
  let token;

  if (authorizationHeader) {
    token = authorizationHeader.split(" ")[1];
  }
  // check client token is same as backend session token
  if (token === req.session?.accessToken) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ message: ["failed to authenticate"] });
      } else {
        const user = await User.findOne({ _id: decoded.sub }).select({
          _id: 1,
          email: 1,
          username: 1,
        });

        if (!user) return res.status(404).json({ message: ["User Not Found"] });

        req.currentUser = user;

        next();
      }
    });
  } else {
    return res.status(403).json({ message: ["No token provided"] });
  }
};
