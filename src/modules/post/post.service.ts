import { Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import {
  ForbiddenException,
  NotFoundException,
} from "../../lib/error/exception.error.js";
import type { IPost } from "../../lib/types/interfaces/post.interface.js";
import type { PostRepository } from "./post.repo.js";
import type { ICloudProvider } from "../../lib/types/interfaces/cloud.interface.js";
import type { CreatePostDto, UpdatePostDto } from "./post.dto.js";
import postError from "./post.error.js";

@injectable()
export class PostService {
  constructor(
    @inject(CONTAINER_TOKENS.repositories.postRepository)
    private readonly postRepository: PostRepository,
    @inject(CONTAINER_TOKENS.utils.cloudProvider)
    private readonly cloudProvider: ICloudProvider,
  ) {}

  createPost = async (createPostDto: CreatePostDto) => {
    const { content, userId, file } = createPostDto;

    const attachmentPath = file
      ? await this.cloudProvider.uploadFile(file, `/posts/${userId}`)
      : undefined;

    return this.postRepository.create({
      userId,
      content,
      attachmentPath,
    });
  };

  getById = async (postId: string) => {
    const post = await this.postRepository.findById(postId);
    if (!post || post.isDeleted) {
      throw new NotFoundException(postError.postNotFound);
    }

    return post;
  };

  list = async () => this.postRepository.listActive();

  update = async (updatePostDto: UpdatePostDto) => {
    const { postId, userId, content, file } = updatePostDto;
    const post = await this.getOwnedPost(postId, userId);
    const updateData: Partial<IPost> = {};

    if (content !== undefined) {
      updateData.content = content;
    }
    if (file) {
      updateData.attachmentPath = await this.cloudProvider.uploadFile(
        file,
        `/posts/${userId}`,
      );
    }

    if (Object.keys(updateData).length === 0) return post;

    return this.postRepository.update({ _id: postId }, updateData);
  };

  softDelete = async (postId: string, userId: string) => {
    await this.getOwnedPost(postId, userId);
    return this.postRepository.softDeleteById(postId);
  };

  private getOwnedPost = async (postId: string, userId: string) => {
    const post = await this.postRepository.findById(postId);
    if (!post || post.isDeleted) {
      throw new NotFoundException(postError.postNotFound);
    }
    if (post.userId.toString() !== userId) {
      throw new ForbiddenException(postError.forbidden);
    }

    return post;
  };
}
