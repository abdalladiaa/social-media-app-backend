import type { GenderEnum } from "../../lib/types/enum/user.enum.js";

export interface RegisterDto {
  firstName: string;
  lastName: string;
  password: string;
  gender?: GenderEnum;
  phone?: string;
  email: string;
}

export interface VerifyAccountDto {
  email: string;
  code: string;
}

export interface SendOtpDto {
  email: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
