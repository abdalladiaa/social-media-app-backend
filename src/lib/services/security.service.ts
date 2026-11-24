import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import config from "../config/config.js";

class SecurityService {
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
}

export default new SecurityService();
