import { z } from "zod";
import type { MulterFileType } from "../../lib/types/multerFile.type.js";
import {
  objectIdValidate,
  phoneNumberValidate,
} from "../../lib/validation/validators.js";
import { GenderEnum } from "../../lib/types/enum/user.enum.js";

export const uploadProfilePictureDtoSchema = z.object({
  userId: objectIdValidate,
});

export const updateUserProfile = z
  .object({
    firstName: z.string().trim().min(3).max(20).optional(),
    lastName: z.string().trim().min(3).max(20).optional(),
    phone: phoneNumberValidate.optional(),
    gender: z.enum(GenderEnum).optional().optional(),
  })
  .strict();

export const followAndUnfollow = z.object({
  userId: objectIdValidate,
});

export type UploadProfilePictureDto = z.infer<
  typeof uploadProfilePictureDtoSchema
> &
  MulterFileType;

export type updateUserProfileDto = z.infer<typeof updateUserProfile>;
