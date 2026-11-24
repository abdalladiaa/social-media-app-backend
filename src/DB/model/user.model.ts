import mongoose from "mongoose";
import { GenderEnum, ProviderEnum } from "../../lib/types/enum/user.enum.js";
import type { IUser } from "../../lib/types/interfaces/user.interface.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [
        3,
        "First name must be at least 3 characters. You entered {VALUE}",
      ],
      maxlength: [20, "First name cannot exceed 20 characters"],
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [
        3,
        "Last name must be at least 3 characters. You entered {VALUE}",
      ],
      maxlength: [20, "Last name cannot exceed 20 characters"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.provider === ProviderEnum.LOCAL;
      },
    },
    profilePicture: {
      type: String,
      
    },
    gender: {
      type: Number,
      enum: GenderEnum,
      default: GenderEnum.OTHER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    twoStepVerificationEnabled: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: Number,
      enum: ProviderEnum,
      default: ProviderEnum.LOCAL,
    },
  },
  {
    timestamps: true,
    virtuals: {
      fullName: {
        get(this: IUser): string {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const User = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", userSchema);

export default User;
