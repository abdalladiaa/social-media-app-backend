import type { NextFunction, Request, Response } from "express";
import authService, { AuthService } from "./auth.service.js";
import { successResponse } from "../../lib/utils/response/success.response.js";
import tokenService, {
  TokenServices,
} from "../../lib/services/token.service.js";
import { TokenTypeEnum } from "../../lib/types/enum/token.enum.js";

class AuthController {
  private readonly authService: AuthService = authService;
  private readonly tokenService: TokenServices = tokenService;

  constructor() {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = await this.authService.register(req.body);
      successResponse({
        res,
        data: userData,
        message: "User registered successfully",
        status: 201,
      });
    } catch (err) {
      next(err);
    }
  };

  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.verifyAccount(req.body);
      successResponse({
        res,
        message: "Account verified successfully",
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  };

  sendOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authService.sendOtp(req.body.email);
      successResponse({
        res,
        message: "OTP sent successfully",
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await authService.login(req.body);

      if (!tokens) {
        successResponse({
          res,
          message: "OTP sent successfully",
        });
        return;
      }

      tokenService.saveTokenInCookie(
        res,
        tokens.accessToken,
        TokenTypeEnum.ACCESS_TOKEN,
      );
      tokenService.saveTokenInCookie(
        res,
        tokens.refreshToken,
        TokenTypeEnum.REFRESH_TOKEN,
      );

      successResponse({
        res,
        message: "user login successfully",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  rotateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await this.authService.rotateToken(req.user!);
      this.tokenService.saveTokenInCookie(
        res,
        tokens.accessToken,
        TokenTypeEnum.ACCESS_TOKEN,
      );
      this.tokenService.saveTokenInCookie(
        res,
        tokens.refreshToken,
        TokenTypeEnum.REFRESH_TOKEN,
      );

      successResponse({
        res,
        status: 200,
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
