import express from "express";
import authenticate from "../middlewares/authenticate";
import {
  login,
  logout,
  register,
  update,
  mfaQrCode,
  verifyOtp,
} from "../controllers/userController/index";

const router = express.Router();

/**
 * Register account
 * POST: api/v1/user/register
 */
router.post("/register", register);
/**
 * Login account
 * POST: api/v1/user/login
 */

router.post("/login", login);

/**
 * Update account
 * PUT: api/v1/user/login
 */
router.put("/update", authenticate, update);

/**
 * Venerates a random secret for the authenticated user (if not yet generated),
 * encodes the configuration URI as a QR code and serves it as a PNG image.
 *
 * GET: api/v1/user/mfaQrCode
 */
router.get("/mfaQrCode", authenticate, mfaQrCode);

/**
 * Either verify 2fa when first enable, or relogin verify
 */

router.post("/verifyOtp", authenticate, verifyOtp);

router.get("/logout", logout);

export default router;
