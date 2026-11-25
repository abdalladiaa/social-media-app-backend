import { z } from "zod";
import { GenderEnum } from "../../lib/types/enum/user.enum.js";
import { phoneNumberValidate } from "../../lib/validation/validators.js";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ error: "Invalid email address" });

export const registerDtoSchema = z.object({
  firstName: z.string().trim().min(3).max(20),
  lastName: z.string().trim().min(3).max(20),
  password: z.string().min(1, { error: "Password is required" }),
  gender: z.enum(GenderEnum).optional(),
  phone: phoneNumberValidate.optional(),
  email: emailSchema,
});

export const verifyAccountDtoSchema = z.object({
  email: emailSchema,
  code: z.union([
    z.string().trim().regex(/^\d{6}$/, { error: "Invalid OTP" }),
    z.number().int().min(100000).max(999999).transform(String),
  ]),
});

export const sendOtpDtoSchema = z.object({
  email: emailSchema,
});

export const loginDtoSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "Password is required" }),
});

export const logInWithGoogleDtoSchema = z.object({
  idToken: z.string(),
});

export type RegisterDto = z.infer<typeof registerDtoSchema>;
export type VerifyAccountDto = z.infer<typeof verifyAccountDtoSchema>;
export type SendOtpDto = z.infer<typeof sendOtpDtoSchema>;
export type LoginDto = z.infer<typeof loginDtoSchema>;
export type logInWithGoogleDto = z.infer<typeof logInWithGoogleDtoSchema>
