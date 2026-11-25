import jwt from "jsonwebtoken";
import type { Response } from "express";
import authError from "../../modules/auth/auth.error.js";
import config from "../config/config.js";
import { TokenTypeEnum } from "../types/enum/token.enum.js";
import type { UserPayload } from "../types/interfaces/userPayload.interface.js";
import { UnAuthorizedException } from "../error/exception.error.js";

export class TokenServices {
  decodeToken(token: string) {
    try {
      return jwt.decode(token);
    } catch (err) {
      throw new UnAuthorizedException(authError.invalidAccessToken);
    }
  }

  generateToken(
    payload: UserPayload,
    tokenType = TokenTypeEnum.ACCESS_TOKEN,
    expiresIn = this.getTokenExpiresIn(tokenType),
  ) {
    const isAccessToken = tokenType === TokenTypeEnum.ACCESS_TOKEN;
    return jwt.sign(
      {
        ...payload as object,
        type: tokenType,
      },
      isAccessToken ? config.jwt.accessSecret : config.jwt.refreshSecret,
      { expiresIn },
    );
  }

  getTokenExpiresIn(tokenType = TokenTypeEnum.ACCESS_TOKEN) {
    return tokenType === TokenTypeEnum.ACCESS_TOKEN
      ? config.jwt.accessExpiresIn
      : config.jwt.refreshExpiresIn;
  }

  getTokenSecret(tokenType = TokenTypeEnum.ACCESS_TOKEN) {
    return tokenType === TokenTypeEnum.ACCESS_TOKEN
      ? config.jwt.accessSecret
      : config.jwt.refreshSecret;
  }

  getTokenTTL(exp: number) {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, exp - now);
  }

  saveTokenInCookie(
    res: Response,
    token: string,
    tokenType = TokenTypeEnum.ACCESS_TOKEN,
  ) {
    const expiresIn = this.getTokenExpiresIn(tokenType);

    res.cookie(tokenType, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn * 1000,
    });

    return true;
  }

  verifyToken(
    token: string,
    secret: string,
    tokenType = TokenTypeEnum.ACCESS_TOKEN,
  ) {
    let payload: UserPayload;
    try {
      payload = jwt.verify(token, secret) as UserPayload;
    } catch (err) {
      throw new UnAuthorizedException(authError.invalidAccessToken);
    }

    if (typeof payload === "string" || payload.type !== tokenType) {
      throw tokenType === TokenTypeEnum.ACCESS_TOKEN
        ? new UnAuthorizedException(authError.invalidAccessToken)
        : new UnAuthorizedException(authError.invalidRefreshToken);
    }
    return payload;
  }
}

export default new TokenServices();