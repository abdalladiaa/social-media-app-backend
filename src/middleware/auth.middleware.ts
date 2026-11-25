import type { Request, Response, NextFunction } from "express";
import { TokenTypeEnum } from "../lib/types/enum/token.enum.js";
import tokenServices from "../lib/services/token.service.js";
import authError from "../modules/auth/auth.error.js";
import { userRevokeTokenKey } from "../utils/cache/userRevokeTokenKey.js";
import cacheClient from "../lib/cache/init.js";
import {
  NotFoundException,
  UnAuthorizedException,
} from "../lib/error/exception.error.js";

export function auth(
  tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS_TOKEN,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.[tokenType] || req.headers?.authorization?.split(" ")[1];
      if (!token) {
        return next(new UnAuthorizedException(authError.unauthorized));
      }
      const secret = tokenServices.getTokenSecret(tokenType);
      const payload = tokenServices.verifyToken(token, secret, tokenType);
      if (!payload.id) {
        return next(new NotFoundException(authError.idNotFound));
      }

      if (payload.type !== tokenType) {
        return next(new UnAuthorizedException(authError.unauthorized));
      }

      const jtiExistInCache = await cacheClient.exists(
        userRevokeTokenKey(payload.id as string, payload.jti),
      );

      if (jtiExistInCache) {
        return next(new UnAuthorizedException(authError.tokenRevoked));
      }

      req.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  };
}
