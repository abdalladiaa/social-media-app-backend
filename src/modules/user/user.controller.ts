import type { NextFunction, Request, Response } from "express";
import userService from "./user.service.js";
import { successResponse } from "../../lib/utils/response/success.response.js";
import type { UploadProfilePictureDto } from "./user.dto.js";

class UserController {
  private readonly userService = userService;

  uploadProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const file = req.file as Express.Multer.File;

 await this.userService.uploadProfilePicture({ file, userId });
      successResponse({
        res,
        message: "Profile picture uploaded successfully",
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new UserController();
