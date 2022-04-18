import express from "express";

import user from "./userRouter";
const rootRouter = express.Router();

rootRouter.use("/user", user);

export default rootRouter;
