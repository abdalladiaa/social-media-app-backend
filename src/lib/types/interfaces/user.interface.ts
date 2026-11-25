import type { Types } from "mongoose";
import type { GenderEnum, ProviderEnum } from "../enum/user.enum.js";

export interface IUser {
  firstName: string | undefined;
  lastName: string | undefined;
  fullName?: string;
  email: string;
  phone?: string | undefined;
  password?: string | undefined;
  profilePicture?: string;
  gender?: GenderEnum | undefined;
  isVerified?: boolean;
  twoStepVerificationEnabled?: boolean;
  provider?: ProviderEnum;
  followers?: (Types.ObjectId[] | string[]) | undefined;
  following?: (Types.ObjectId[] | string[]) | undefined;
}
