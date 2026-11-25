import { inject, injectable } from "tsyringe";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import type { PostService } from "./post.service.js";
import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../../lib/utils/response/success.response.js";
@injectable()
export class PostController {
  constructor(
    @inject(CONTAINER_TOKENS.services.postService)
    private readonly postService: PostService,
  ) {}

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.createPost(req.body);

      successResponse({
        res,
        status: 201,
        message: "Post created successfully",
        data: post,
      });
    } catch (err) {
      next(err);
    }
  };
}
