import type { UserPayload } from "./interfaces/userPayload.interface.ts";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}