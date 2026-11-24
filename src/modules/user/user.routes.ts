import { Router } from "express";
import userController from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

import { UploadMimeTypes } from "../../lib/constants/file.constants.js";
import { UploadSingle } from "../../lib/media/multer.js";
import { fileValidationMiddleware } from "../../middleware/validation.middleware.js";

const userRouter = Router();

userRouter.patch(
  "/upload-profile-pic",
  authMiddleware(),
  UploadSingle("pp" , UploadMimeTypes.PROFILE_IMAGE),
  fileValidationMiddleware(UploadMimeTypes.PROFILE_IMAGE),
  userController.uploadProfilePicture,
);

export default userRouter;
