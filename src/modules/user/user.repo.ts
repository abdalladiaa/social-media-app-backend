import type { HydratedDocument, ProjectionType } from "mongoose";
import User from "../../DB/model/user.model.js";
import type { IUser } from "../../lib/types/interfaces/user.interface.js";
import Repository from "../../lib/repository/repository.js";

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

  async updateByEmail(email:string, updateData: Partial<IUser>) {
    return this.update({ email }, updateData);
  }
}

export default new UserRepository();
