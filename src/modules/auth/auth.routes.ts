import { Router } from "express";
import authController from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../lib/types/enum/token.enum.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.patch("/verify-account", authController.verifyAccount);
authRouter.post("/send-otp", authController.sendOtp);
authRouter.post("/login" , authController.login)
authRouter.post("/rotate-token" , authMiddleware(TokenTypeEnum.REFRESH_TOKEN) , authController.rotateToken)

export default authRouter;
