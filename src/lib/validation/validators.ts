import mongoose from "mongoose";
import z from "zod";

export const objectIdValidate = z
  .string()
  .refine((value) => mongoose.Types.ObjectId.isValid(value), {
    message: "Invalid ObjectId",
  });

export const phoneNumberValidate = z
  .string()
  .regex(/^01[0125]\d{8}$/, { error: "Invalid Egyptian phone number" });
