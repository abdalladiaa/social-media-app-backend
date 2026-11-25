import { Router } from "express";
import { auth } from "../../middleware/auth.middleware.js";
import { TokenTypeEnum } from "../../lib/types/enum/token.enum.js";
import container from "../../lib/di/container.js";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import {
  loginDtoSchema,
  logInWithGoogleDtoSchema,
  registerDtoSchema,
  sendOtpDtoSchema,
  verifyAccountDtoSchema,
} from "./auth.dto.js";
import type { AuthController } from "./auth.controller.js";
import { validateDto } from "../../middleware/validation.middleware.js";

const authRouter = Router();
const authController = container.resolve<AuthController>(
  CONTAINER_TOKENS.controllers.authController,
);

authRouter.post(
  "/register",
  validateDto(registerDtoSchema, "body"),
  authController.register,
);
authRouter.patch(
  "/verify-account",
  validateDto(verifyAccountDtoSchema, "body"),
  authController.verifyAccount,
);
authRouter.post(
  "/send-otp",
  validateDto(sendOtpDtoSchema),
  authController.sendOtp,
);
authRouter.post(
  "/login",
  validateDto(loginDtoSchema, "body"),
  authController.login,
);
authRouter.post(
  "/rotate-token",
  auth(TokenTypeEnum.REFRESH_TOKEN),
  authController.rotateToken,
);
authRouter.post(
  "/login-with-google",
  validateDto(logInWithGoogleDtoSchema, "body"),
  authController.loginWithGoogle,
);
authRouter.post(
  "/revoke-token",
  auth(TokenTypeEnum.REFRESH_TOKEN),
  authController.revokeToken,
);

export default authRouter;
