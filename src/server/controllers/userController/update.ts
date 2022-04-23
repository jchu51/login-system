import { Request, Response } from "express";
import User from "../../models/user";
import generateBearerToken from "../../utils/auth/generateBearerToken";

/**
 * * This function help us to update the user infomation
 *
 * @param req {username,email}
 * @param res
 * @returns {object}
 */
const update = async (req: Request, res: Response) => {
  const { body } = req;
  if (!body) {
    return res.status(400).send({ success: false, message: "No body" });
  }

  const user = await User.findOneAndUpdate(
    { _id: req.currentUser._id },
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  ).select(["-password"]);

  if (!user)
    return res.status(404).json({ success: false, message: "User Not Found" });
  //Generate new bearer token
  const accessToken = generateBearerToken(user._id);
  req.session.accessToken = accessToken;
  res.cookie("token", { user: user.toJSON(), accessToken });

  return res.status(200).send({
    success: true,
    message: "Updated successfully!",
    data: { user },
  });
};
export default update;
