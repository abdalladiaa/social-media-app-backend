import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../lib/utils/response/success.response.js";
import type { TokenServices } from "../../lib/services/token.service.js";
import { TokenTypeEnum } from "../../lib/types/enum/token.enum.js";
import { inject, injectable } from "tsyringe";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import type { AuthService } from "./auth.service.js";
import type { UserPayload } from "../../lib/types/interfaces/userPayload.interface.js";

@injectable()
export class AuthController {
  constructor(
    @inject(CONTAINER_TOKENS.services.authService)
    private readonly authService: AuthService,
    @inject(CONTAINER_TOKENS.utils.tokenService)
    private readonly tokenService: TokenServices,
  ) {}

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
      const tokens = await this.authService.login(req.body);

      if (!tokens) {
        successResponse({
          res,
          message: "OTP sent successfully",
        });
        return;
      }

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

  loginWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idToken } = req.body;

      const { accessToken, refreshToken } =
        await this.authService.logInWithGoogle(idToken);
      const user = this.tokenService.decodeToken(accessToken);

      this.tokenService.saveTokenInCookie(res, accessToken);
      this.tokenService.saveTokenInCookie(
        res,
        refreshToken,
        TokenTypeEnum.REFRESH_TOKEN,
      );

      successResponse({
        res,
        status: 200,
        message: "user logged in successfully",
        data: {
          user,
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  revokeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as UserPayload;

      const result = await this.authService.revokeToken(user);
      successResponse({ res, status: 200, data: { result } });
    } catch (err) {
      next(err);
    }
  };
}
