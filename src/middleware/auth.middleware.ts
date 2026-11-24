import type { Request, Response, NextFunction } from "express";
import { TokenTypeEnum } from "../lib/types/enum/token.enum.js";
import tokenServices from "../lib/services/token.service.js";
import authError from "../modules/auth/auth.error.js";
import { userRevokeTokenKey } from "../utils/cache/userRevokeTokenKey.js";
import cacheClient from "../lib/cache/init.js";

export function authMiddleware(
  tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS_TOKEN,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token =
        req.cookies?.[tokenType] || req.headers?.authorization?.split(" ")[1];
      if (!token) {
        return next(authError.unauthorized())
      }
      const secret = tokenServices.getTokenSecret(tokenType);
      const payload = tokenServices.verifyToken(token, secret, tokenType);
      if (!payload.id) {
        return next(authError.idNotFound())
      }

      if (payload.type !== tokenType) {
        return next(authError.unauthorized());
      }

      const jtiExistInCache = await cacheClient.exists(
        userRevokeTokenKey(payload.id, payload.jti),
      );

      if (jtiExistInCache) {
        return next(authError.tokenRevoked());
      }

      req.user = payload;
      next();
    } catch (err) {
      next(err);
    }
  };
}
