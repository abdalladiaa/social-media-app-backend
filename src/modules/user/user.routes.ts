import { Router } from "express";
import type { UserController } from "./user.controller.js";
import { auth } from "../../middleware/auth.middleware.js";

import { UploadMimeTypes } from "../../lib/constants/file.constants.js";
import { UploadSingle } from "../../lib/media/multer.js";
import {
  fileValidationMiddleware,
  validateDto,
} from "../../middleware/validation.middleware.js";
import { container } from "tsyringe";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import { followAndUnfollow, updateUserProfile } from "./user.dto.js";

const userRouter = Router();

const userController = container.resolve<UserController>(
  CONTAINER_TOKENS.controllers.userController,
);

userRouter.get("/get-profile", auth(), userController.getProfile);
userRouter.patch(
  "/upload-profile-pic",
  auth(),
  UploadSingle("pp", UploadMimeTypes.PROFILE_IMAGE),
  fileValidationMiddleware(UploadMimeTypes.PROFILE_IMAGE),
  userController.uploadProfilePicture,
);
userRouter.patch(
  "/update-profile",
  validateDto(updateUserProfile),
  auth(),
  userController.updateUserProfile,
);
userRouter.post("/follow/:userId" , validateDto(followAndUnfollow , "params") ,auth() , userController.addFollow)
userRouter.delete("/follow/:userId" , validateDto(followAndUnfollow , "params") ,auth() , userController.unFollow)

export default userRouter;
