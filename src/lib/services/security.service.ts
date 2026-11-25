import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import config from "../config/config.js";
import { GoogleToken, OAuth2Client } from "google-auth-library";
import { logger } from "../../pkg/log/logger.js";
import { UnAuthorizedException } from "../error/exception.error.js";
import userError from "../../modules/user/user.error.js";

export const client = new OAuth2Client(config.google.clientId);

export class SecurityService {
  async hashPassword(password: string, salt = config.encryption.saltRound) {
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string | Buffer<ArrayBufferLike>,
    hashedPassword: string,
  ) {
    return bcrypt.compare(password, hashedPassword);
  }

  encrypt(text: string) {
    return CryptoJS.AES.encrypt(text, config.encryption.key).toString();
  }

  decrypt(encryptedText: string) {
    return CryptoJS.AES.decrypt(encryptedText, config.encryption.key).toString(
      CryptoJS.enc.Utf8,
    );
  }

  async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: config.google.clientId,
      });
      return ticket.getPayload();
    } catch (err) {
      logger.error("Google token verification failed", {
        reason: "invalid_or_expired_google_id_token",
      });
      throw new UnAuthorizedException(userError.invalidGoogleToken);
    }
  }
}

export default new SecurityService();
