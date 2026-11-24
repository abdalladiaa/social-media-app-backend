
import { OtpSendEmailEnum } from "../../lib/types/enum/send-email.enum.js";
import { newOtpTemplate } from "../../templates/newOtp.template.js";
import { resetPasswordTemplate } from "../../templates/resetPassword.template.js";
import { twoStepVerificationTemplate } from "../../templates/twoStepVerification.template.js";
import { verifyEmailTemplate } from "../../templates/verifyEmail.template.js";

export const getEmailTemplate = ({type, otp}: { type: OtpSendEmailEnum; otp: number }) => {
  switch (type) {
    case OtpSendEmailEnum.RESET_PASSWORD:
      return {
        subject: "Reset Password OTP",
        html: resetPasswordTemplate(otp),
      };

    case OtpSendEmailEnum.TWO_STEP_VERIFICATION:
      return {
        subject: "Two-Step Verification",
        html: twoStepVerificationTemplate(otp),
      };

    case OtpSendEmailEnum.VERIFY_EMAIL:
      return {
        subject: "Verify Email OTP",
        html: verifyEmailTemplate(otp),
      };

    case OtpSendEmailEnum.NEW_OTP:
      return {
        subject: "Verify Email OTP",
        html: newOtpTemplate({ otp }),
      };

    default:
      throw new Error(`Unsupported email type: ${type}`);
  }
};
