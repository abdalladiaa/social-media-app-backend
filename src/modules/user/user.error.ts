import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnAuthorizedException,
} from "../../lib/error/exception.error.js";

const userError = {
  userAlreadyExists: () => new ConflictException("User already exists"),

  userNotFound: () => new NotFoundException("User not found"),

  invalidCredentials: () => new UnAuthorizedException("Invalid email or password"),

  emailAlreadyVerified: () => new ConflictException("Email is already verified"),

  emailNotVerified: () => new ForbiddenException("Email is not verified"),

  invalidOtp: () => new BadRequestException("Invalid OTP"),

  otpExpired: () => new BadRequestException("OTP has expired"),

  otpAlreadyUsed: () => new BadRequestException("OTP has already been used"),

  passwordIncorrect: () => new UnAuthorizedException("Incorrect password"),

  passwordRequired: () => new BadRequestException("Password is required"),

  emailRequired: () => new BadRequestException("Email is required"),

  invalidEmail: () => new BadRequestException("Invalid email address"),

  accountNotVerified: () =>
    new ForbiddenException("Please verify your email first"),

  unauthorized: () => new UnAuthorizedException("Unauthorized"),

  invalidGoogleToken: () => new UnAuthorizedException("Invalid Google token"),

  googleAccount: () =>
    new BadRequestException(
      "This account was created with Google. Please continue with Google.",
    ),
};

export default userError;
