import { z } from "zod";
import postError from "./post.error.js";
import { Types } from "mongoose";
import { objectIdValidate } from "../../lib/validation/validators.js";
import type { MulterFileType } from "../../lib/types/multerFile.type.js";


const postContentSchema = z
  .string()
  .trim()
  .min(1, { error: postError.contentRequired })
  .max(200, { error: postError.contentLengthInvalid });

export const createPostDtoSchema = z.object({
  content: postContentSchema,
  userId: objectIdValidate,
});

export const updatePostDtoSchema = z.object({
  postId: objectIdValidate,
  userId: objectIdValidate,
  content: postContentSchema.optional(),
});

export type CreatePostDto = z.infer<typeof createPostDtoSchema> & MulterFileType;
export type UpdatePostDto = z.infer<typeof updatePostDtoSchema> & MulterFileType;
