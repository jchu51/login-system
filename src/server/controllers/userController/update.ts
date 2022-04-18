import { Request, Response } from "express";
import User from "../../models/user";

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

  const { username, email }: { username: string; email: string } = body;
  const user = await User.findOneAndUpdate(
    { _id: req.currentUser._id },
    {
      $set: {
        username,
        email,
      },
    },
    { new: true }
  ).select(["-password"]);

  if (!user)
    return res.status(404).json({ success: false, message: "User Not Found" });

  return res.status(200).send({
    success: true,
    message: "Updated successfully!",
    data: user,
  });
};
export default update;
