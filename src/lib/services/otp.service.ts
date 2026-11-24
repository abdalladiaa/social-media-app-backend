import crypto from "node:crypto";
import cacheClient from "../cache/init.js";
import { emailOTPExpiresIn } from "../constants/constants.js";
import { OtpSendEmailEnum } from "../types/enum/send-email.enum.js";
import { sendEmailEvent } from "../notification/mail.js";
import { getEmailTemplate } from "../../utils/email/get-email-template.js";

interface CreateOtpParams {
  email: string;
  code: number;
  ttl?: number;
}

interface CreateOtpOptions {
  emailType?: OtpSendEmailEnum;
}

class OtpService {
  async generateOtp() {
    return crypto.randomInt(100000, 1000000);
  }

  async createOtp(
    {
      email,
      code,
      ttl = emailOTPExpiresIn,
    }: CreateOtpParams,
    { emailType = OtpSendEmailEnum.NEW_OTP }: CreateOtpOptions = {},
  ) {
    const result = await cacheClient.set(this.getOtpKey(email), code, ttl);
    const emailTemplate = getEmailTemplate({ type: emailType, otp: code });

    sendEmailEvent.emit("send-email", {
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return result;
  }

  async getOtpByEmail(email: string) {
    return cacheClient.get(this.getOtpKey(email));
  }

  async deleteOtpByEmail(email: string) {
    return cacheClient.del(this.getOtpKey(email));
  }

  private getOtpKey(email: string) {
    return `OTP:VerifyEmail:${email}`;
  }
}

export default new OtpService();
