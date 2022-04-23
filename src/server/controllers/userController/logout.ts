import { Request, Response } from "express";

/**
 * This function help to logout user,
 *
 * @param req
 * @param res
 * @returns {object}
 */
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("sessionToken");
    res.clearCookie("token");

    return res.status(200).send({
      success: true,
    });
  } catch (err) {
    console.error(`Failed to logout: ${err}`);

    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

export default logout;
