import type { Types } from "mongoose";

export interface IPost {
  content: string;
  attachmentPath?: string | undefined;
  userId: Types.ObjectId | string;
  isDeleted?: boolean;
  commentCounts?: number;
  reactionCounts?: number;
  allowsComments?: boolean;
}
