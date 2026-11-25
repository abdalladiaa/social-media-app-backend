import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../../lib/utils/response/success.response.js";
import { inject, injectable } from "tsyringe";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import type { UserService } from "./user.service.js";

@injectable()
export class UserController {
  constructor(
    @inject(CONTAINER_TOKENS.services.userService)
    private readonly userService: UserService,
  ) {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getProfile(req.user?.id as string);

      successResponse({ res, data: user, status: 200 });
    } catch (err) {
      next(err);
    }
  };

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

  updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id as string;
      const user = await this.userService.updateUserProfile(req.body, userId);
      successResponse({
        res,
        data: user,
        message: "user updated successfully",
        status: 200,
      });
    } catch (err) {
      next(err);
    }
  };

  addFollow = async(req: Request,res: Response,next: NextFunction)=>{
    try{
      const currentUserId = req.user?.id as string
      const targetUserId = req.params.userId as string
      await this.userService.follow(currentUserId , targetUserId)
      successResponse({
        res,
        message:"Followed successfully"
      })
    }catch(err){
      next(err)
    }
  }
  unFollow = async(req: Request,res: Response,next: NextFunction)=>{
    try{
      const currentUserId = req.user?.id as string
      const targetUserId = req.params.userId as string
      await this.userService.unFollow(currentUserId , targetUserId)
      successResponse({
        res,
        message:"UnFollowed successfully"
      })
    }catch(err){
      next(err)
    }
  }

}
