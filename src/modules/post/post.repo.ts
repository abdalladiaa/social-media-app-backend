import Post from "../../DB/model/post.model.js";
import type { IPost } from "../../lib/types/interfaces/post.interface.js";
import Repository from "../../lib/repository/repository.js";
import { injectable } from "tsyringe";
import type { Types } from "mongoose";

@injectable()
export class PostRepository extends Repository<IPost> {
  constructor() {
    super(Post);
  }

  listActive() {
    return Post.find({ isDeleted: false }).sort({ createdAt: -1 });
  }

  softDeleteById(id: string | Types.ObjectId) {
    return this.update({ _id: id }, { isDeleted: true });
  }
}
