import express from "express";
import authenticate from "../middlewares/authenticate";
import { login, register, update } from "../controllers/userController/index";

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

export default router;
