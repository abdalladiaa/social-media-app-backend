import type { ICloudProvider } from "../../lib/types/interfaces/cloud.interface.js";
import type {
  updateUserProfile,
  updateUserProfileDto,
  UploadProfilePictureDto,
} from "./user.dto.js";
import {
  BadRequestException,
  NotFoundException,
} from "../../lib/error/exception.error.js";
import userError from "./user.error.js";
import { inject, injectable } from "tsyringe";
import { CONTAINER_TOKENS } from "../../lib/constants/di-tokens.constants.js";
import type { UserRepository } from "./user.repo.js";

@injectable()
export class UserService {
  constructor(
    @inject(CONTAINER_TOKENS.repositories.userRepository)
    private readonly userRepository: UserRepository,
    @inject(CONTAINER_TOKENS.utils.cloudProvider)
    private readonly cloudProvider: ICloudProvider,
  ) {}

  getProfile = async (id: string) => {
    const userExist = await this.userRepository.findById(id);
    if (!userExist) throw new NotFoundException(userError.userNotFound);

    return userExist;
  };

  uploadProfilePicture = async (
    uploadProfilePictureDto: UploadProfilePictureDto,
  ) => {
    const { file, userId } = uploadProfilePictureDto;
    const key = await this.cloudProvider.uploadFile(file, `/users/${userId}`);
    this.userRepository.update({ _id: userId }, { profilePicture: key });
  };

  updateUserProfile = async (
    updateUserProfileDto: updateUserProfileDto,
    userId: string,
  ) => {
    if (Object.keys(updateUserProfileDto).length === 0) {
      throw new BadRequestException("At least one field is required");
    }

    const updatedUser = await this.userRepository.update(
      { _id: userId },
      updateUserProfileDto,
    );

    return updatedUser;
  };

  async follow(currentUserId: string, targetUserId: string) {
  if (currentUserId === targetUserId) {
    throw new BadRequestException("You cannot follow yourself");
  }

  const targetUser = await this.userRepository.findById(targetUserId);

  if (!targetUser) {
    throw new NotFoundException(userError.userNotFound);
  }

  await this.userRepository.addFollow(
    currentUserId,
    targetUserId
  );
}
  async unFollow(currentUserId: string, targetUserId: string) {
  if (currentUserId === targetUserId) {
    throw new BadRequestException("You cannot unFollow yourself");
  }

  const targetUser = await this.userRepository.findById(targetUserId);

  if (!targetUser) {
    throw new NotFoundException(userError.userNotFound);
  }

  await this.userRepository.removeFollow(
    currentUserId,
    targetUserId
  );
}
}
