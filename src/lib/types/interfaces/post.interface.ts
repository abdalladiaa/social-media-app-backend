import type { Types } from "mongoose";

export interface IPost{
    content:string,
    userId:Types.ObjectId,
    commentsCount:number,
    reactsCount:number,
    allowsComments:boolean
}