import type { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  id: string;
  jti: string;
  email: string;
  fullName: string;
}