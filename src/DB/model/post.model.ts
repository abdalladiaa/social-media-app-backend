import mongoose, { Types } from "mongoose";
import type { IPost } from "../../lib/types/interfaces/post.interface.js";

const postSchema = new mongoose.Schema<IPost>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 200,
    },
    attachmentPath: {
      type: String,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    commentCounts: {
      type: Number,
      default: 0,
    },
    reactionCounts: {
      type: Number,
      default: 0,
    },
    allowsComments: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Post =
  (mongoose.models.Post as mongoose.Model<IPost>) ||
  mongoose.model<IPost>("Post", postSchema);

export default Post;
