import type { JwtPayload } from "jsonwebtoken";
import type { Types } from "mongoose";

export interface UserPayload extends JwtPayload {
  id: Types.ObjectId | string;
  jti: string;
  email: string;
  fullName: string | undefined;
}