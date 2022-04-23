import { Request, Response } from "express";
import { authenticator } from "otplib";
import qrcode from "qrcode";

const generateMfaQrCode = async (req: Request, res: Response) => {
  try {
    const user = req.currentUser;

    // For security, we no longer show the QR code after is verified
    if (user.mfaEnabled) return res.status(404).end();

    const service = "JC - PlayGround";
    // const token = authenticator.generate(process.env.MFA_SECRET);
    const secret = authenticator.generateSecret(); 
    const otpauth = authenticator.keyuri(user.username, service, secret);

    req.session.mfaToken = secret;
    qrcode.toDataURL(otpauth, (err, imageUrl) => {
      if (err) {
        console.log("Error with QR");
        return;
      }
      return res.status(200).send({
        success: true,
        data: imageUrl,
      });
    });
  } catch (err) {
    console.error(`Failed to generate MFA QR Code: ${err}`);

    return res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};

export default generateMfaQrCode;
