import type { HydratedDocument, ProjectionType } from "mongoose";
import User from "../../DB/model/user.model.js";
import type { IUser } from "../../lib/types/interfaces/user.interface.js";
import Repository from "../../lib/repository/repository.js";
import { injectable } from "tsyringe";

@injectable()
export class UserRepository extends Repository<IUser> {
  constructor() {
    super(User);
  }
  async findByEmail(
    email: string,
    projection?: ProjectionType<IUser>,
  ): Promise<HydratedDocument<IUser> | null> {
    return this.findOne({ email }, projection);
  }

  async updateByEmail(email: string, updateData: Partial<IUser>) {
    return this.update({ email }, updateData);
  }

  async addFollow(currentUserId: string, targetUserId: string) {
    await Promise.all([
      User.updateOne(
        { _id: currentUserId },
        { $addToSet: { following: targetUserId } },
      ),

      User.updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: currentUserId } },
      ),
    ]);
  }

  async removeFollow(currentUserId: string, targetUserId: string) {
    await Promise.all([
      User.updateOne(
        { _id: currentUserId },
        { $pull: { following: targetUserId } },
      ),

      User.updateOne(
        { _id: targetUserId },
        { $pull: { followers: currentUserId } },
      ),
    ]);
  }
  
}

export default new UserRepository();
